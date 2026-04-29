from django.contrib import admin
import nested_admin
from .models import Course, Exam, Question, Choice, ExamAttempt, Answer

class ChoiceInline(nested_admin.NestedTabularInline):
    model = Choice
    extra = 4

class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    extra = 1
    inlines = [ChoiceInline] # This is the "Magic" nesting

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'teacher')
    search_fields = ('name', 'code')

@admin.register(Exam)
class ExamAdmin(nested_admin.NestedModelAdmin):
    list_display = ('title', 'course', 'start_time', 'duration', 'is_published')
    list_filter = ('is_published', 'course')
    search_fields = ('title',)
    inlines = [QuestionInline] # Add questions without leaving the page

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'exam', 'question_type', 'marks', 'order')
    list_filter = ('exam', 'question_type')
    inlines = [ChoiceInline] # Add choices directly to the question

@admin.register(ExamAttempt)
class ExamAttemptAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'status', 'score', 'start_time')
    list_filter = ('status', 'exam')
    readonly_fields = ('start_time',) # Prevent manual tampering with timestamps

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'is_correct', 'marks_awarded')
    list_filter = ('is_correct',)