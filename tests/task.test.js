/**
 * Automated Tests
 * Student Management System
 */

const {
    escapeHTML,
    getBotResponse,
    addTaskForTest,
    completeTaskForTest,
    resetTasksForTest
} = require('../script');


describe('Student Task Manager', () => {

    // Reset application data before every test
    beforeEach(() => {
        resetTasksForTest();
    });


    // ==========================================
    // Test 1 - HTML escaping
    // ==========================================

    test('should escape HTML characters correctly', () => {

        const result = escapeHTML(
            '<script>alert("XSS")</script>'
        );

        expect(result).toBe(
            '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
        );
    });


    // ==========================================
    // Test 2 - Create task
    // ==========================================

    test('should create a new task', () => {

        const task = addTaskForTest(
            'Complete Jenkins Assignment',
            'High',
            '2026-10-01'
        );

        expect(task.title).toBe(
            'Complete Jenkins Assignment'
        );

        expect(task.priority).toBe('High');

        expect(task.dueDate).toBe('2026-10-01');

        expect(task.completed).toBe(false);
    });


    // ==========================================
    // Test 3 - Complete task
    // ==========================================

    test('should mark a task as completed', () => {

        const task = addTaskForTest(
            'Finish Testing',
            'Medium',
            '2026-10-02'
        );

        const completedTask =
            completeTaskForTest(task.id);

        expect(completedTask.completed).toBe(true);
    });


    // ==========================================
    // Test 4 - Completed chatbot response
    // ==========================================

    test('should return completed task information', () => {

        const task = addTaskForTest(
            'Complete Jenkins Testing',
            'Medium',
            '2026-10-02'
        );

        completeTaskForTest(task.id);

        const response =
            getBotResponse('completed');

        expect(response).toContain('completed');

        expect(response).toContain('1');
    });


    // ==========================================
    // Test 5 - Pending task response
    // ==========================================

    test('should return pending task information', () => {

        addTaskForTest(
            'Complete Jenkins Pipeline',
            'High',
            '2026-10-03'
        );

        const response =
            getBotResponse(
                'How many pending tasks do I have?'
            );

        expect(response).toContain('pending');

        expect(response).toContain(
            'Complete Jenkins Pipeline'
        );
    });


    // ==========================================
    // Test 6 - High priority task
    // ==========================================

    test('should identify high priority tasks', () => {

        addTaskForTest(
            'Submit Assignment',
            'High',
            '2026-10-04'
        );

        const response =
            getBotResponse(
                'Show high priority tasks'
            );

        expect(response).toContain(
            'High Priority Tasks'
        );

        expect(response).toContain(
            'Submit Assignment'
        );
    });


    // ==========================================
    // Test 7 - Add task instructions
    // ==========================================

    test('should provide instructions for adding a task', () => {

        const response =
            getBotResponse(
                'How do I add a task?'
            );

        expect(response).toContain(
            'add a task'
        );
    });


    // ==========================================
    // Test 8 - Hello response
    // ==========================================

    test('should respond to hello', () => {

        const response =
            getBotResponse('Hello');

        expect(response).toContain(
            'Hello'
        );
    });


    // ==========================================
    // Test 9 - Delete instruction
    // ==========================================

    test('should provide delete instructions', () => {

        const response =
            getBotResponse(
                'How do I delete a task?'
            );

        expect(response).toContain(
            'Trash'
        );
    });


    // ==========================================
    // Test 10 - Edit instruction
    // ==========================================

    test('should provide edit instructions', () => {

        const response =
            getBotResponse(
                'How do I edit a task?'
            );

        expect(response).toContain(
            'Pencil'
        );
    });

});
