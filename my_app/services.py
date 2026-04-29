# exams/services.py
from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError
from datetime import timedelta
from .models import ExamAttempt, Answer, Question, Choice

def validate_timer(attempt):
    """Checks if the student has exceeded the exam duration."""
    limit = attempt.start_time + timedelta(minutes=attempt.exam.duration)
    if timezone.now() > limit:
        submit_exam(attempt)
        raise ValidationError("Time limit exceeded. Exam has been auto-submitted.")

def start_exam(user, exam):
    # Double check for existing attempts to prevent race conditions
    if ExamAttempt.objects.filter(student=user, exam=exam).exists():
        raise ValidationError("Attempt already exists.")
        
    return ExamAttempt.objects.create(
        student=user,
        exam=exam,
        start_time=timezone.now(),
        status='IN_PROGRESS'
    )

def save_answer(attempt, question_id, choice_id=None, text_answer=None):
    validate_timer(attempt)
    
    # 1. Security: Validate question belongs to this specific exam
    try:
        question = Question.objects.get(id=question_id, exam=attempt.exam)
    except Question.DoesNotExist:
        raise ValidationError("This question does not belong to the current exam.")

    # 2. Atomic update or create
    answer, _ = Answer.objects.update_or_create(
        attempt=attempt,
        question=question,
        defaults={
            'selected_choice_id': choice_id,
            'text_answer': text_answer
        }
    )
    return answer

def submit_exam(attempt):
    if attempt.status != 'IN_PROGRESS':
        return attempt # Already submitted

    total_score = 0

    with transaction.atomic():
        # Optimization: Fetch all answers and related correct choices in one query
        answers = attempt.answers.select_related('question', 'selected_choice')
        
        for answer in answers:
            q = answer.question
            if q.question_type == 'MCQ':
                # Check if choice exists and is correct
                if answer.selected_choice and answer.selected_choice.is_correct:
                    answer.is_correct = True
                    answer.marks_awarded = q.marks
                    total_score += q.marks
                else:
                    answer.is_correct = False
                    answer.marks_awarded = 0
            
            # Additional logic for 'TEXT' types could go here (manual grading)
            answer.save()

        attempt.score = total_score
        attempt.status = 'SUBMITTED'
        attempt.end_time = timezone.now()
        attempt.save()

    return attempt