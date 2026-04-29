from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from .models import Exam, ExamAttempt, Answer
from .serializers import StartAttemptSerializer, AnswerSerializer
from .services import start_exam, save_answer, submit_exam
from .permissions import IsStudent

class ExamViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsStudent]

    @action(detail=False, methods=['post'])
    def start(self, request):
        serializer = StartAttemptSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        # Use get_object_or_404 for cleaner error handling
        exam = get_object_or_404(Exam, id=serializer.validated_data['exam_id'], is_published=True)
        attempt = start_exam(request.user, exam)

        return Response({
            "attempt_id": attempt.id,
            "start_time": attempt.start_time
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def detail(self, request, pk=None):
        """
        Retrieves exam questions, choices, and the student's existing answers.
        """
        # 1. Fetch attempt with exam info in ONE query
        attempt = get_object_or_404(
            ExamAttempt.objects.select_related('exam'), 
            id=pk, 
            student=request.user
        )

        # 2. Timer Enforcement: Auto-submit if time is up
        limit = attempt.start_time + timedelta(minutes=attempt.exam.duration)
        if timezone.now() > limit and attempt.status == 'IN_PROGRESS':
            submit_exam(attempt)
            return Response({
                "message": "Time limit exceeded. Exam submitted.",
                "status": "SUBMITTED"
            }, status=status.HTTP_403_FORBIDDEN)

        # 3. Optimization: Prefetch questions AND existing answers to avoid N+1 queries
        # We also prefetch choices for those questions
        questions = attempt.exam.questions.prefetch_related('choices')
        
        # Map existing answers by question_id for quick lookup
        existing_answers = {
            ans.question_id: ans 
            for ans in attempt.answers.all()
        }

        # 4. Construct Payload
        question_data = []
        for q in questions:
            user_answer = existing_answers.get(q.id)
            question_data.append({
                "id": q.id,
                "text": q.text,
                "type": q.question_type,
                "marks": q.marks,
                # Student's current progress
                "current_answer": {
                    "choice_id": user_answer.selected_choice_id if user_answer else None,
                    "text_answer": user_answer.text_answer if user_answer else None
                },
                "choices": [
                    {"id": c.id, "text": c.text}
                    for c in q.choices.all()
                ]
            })

        return Response({
            "exam_title": attempt.exam.title,
            "status": attempt.status,
            "remaining_seconds": max(0, (limit - timezone.now()).total_seconds()),
            "questions": question_data
        })

    @action(detail=True, methods=['post'])
    def answer(self, request, pk=None):
        attempt = get_object_or_404(ExamAttempt, id=pk, student=request.user)

        if attempt.status != 'IN_PROGRESS':
            return Response({"error": "Exam already submitted"}, status=400)

        serializer = AnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Service layer handles time checks and logic
        save_answer(
            attempt,
            serializer.validated_data['question_id'],
            serializer.validated_data.get('choice_id'),
            serializer.validated_data.get('text_answer')
        )

        return Response({"message": "Answer saved"})

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        attempt = get_object_or_404(ExamAttempt, id=pk, student=request.user)
        attempt = submit_exam(attempt)

        return Response({
            "score": attempt.score,
            "status": attempt.status
        })


    def list(self, request):
        """
        Returns a list of all published exams with the student's 
        attempt status (Started, Finished, or Not Started).
        """
        # Get all published exams
        exams = Exam.objects.filter(is_published=True)
        
        # Get all attempts by this student to show progress
        student_attempts = ExamAttempt.objects.filter(student=request.user)
        attempt_map = {attempt.exam_id: attempt.status for attempt in student_attempts}

        data = []
        for exam in exams:
            data.append({
                "id": exam.id,
                "title": exam.title,
                "duration": exam.duration,
                "status": attempt_map.get(exam.id, "NOT_STARTED")
            })

        return Response(data)