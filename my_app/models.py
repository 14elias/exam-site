from django.db import models

# Create your models here.

# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings



class Course(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'TEACHER'})


class Exam(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams')

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_exams')

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration = models.IntegerField(help_text="Duration in minutes")

    total_marks = models.IntegerField()

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    QUESTION_TYPES = (
        ('MCQ', 'Multiple Choice'),
        ('TEXT', 'Text'),
    )

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')

    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)

    marks = models.FloatField()

    order = models.IntegerField()

    def __str__(self):
        return f"{self.exam.title} - Q{self.order}"


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')

    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)


class ExamAttempt(models.Model):
    STATUS_CHOICES = (
        ('IN_PROGRESS', 'In Progress'),
        ('SUBMITTED', 'Submitted'),
        ('AUTO_SUBMITTED', 'Auto Submitted'),
    )

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    score = models.FloatField(default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_PROGRESS')

    class Meta:
        indexes = [
            models.Index(fields=['student', 'exam']),
            models.Index(fields=['status']),
        ]
        unique_together = ('student', 'exam')  # Prevent multiple attempts


class Answer(models.Model):
    attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name='answers')

    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(null=True, blank=True)

    is_correct = models.BooleanField(null=True)  # evaluated later
    marks_awarded = models.FloatField(default=0)

