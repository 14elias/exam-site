# exams/serializers.py
from rest_framework import serializers
from .models import Exam, ExamAttempt

class StartAttemptSerializer(serializers.Serializer):
    exam_id = serializers.IntegerField()

    def validate(self, data):
        user = self.context['request'].user
        exam = Exam.objects.get(id=data['exam_id'])

        if not exam.is_published:
            raise serializers.ValidationError("Exam not available")

        if ExamAttempt.objects.filter(student=user, exam=exam).exists():
            raise serializers.ValidationError("You already attempted this exam")

        return data


class AnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField(required=False)
    text_answer = serializers.CharField(required=False)