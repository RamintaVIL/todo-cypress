const pageUrl = "https://todolist.james.am/#/"

describe('Form Display', () => {
  beforeEach(() => {
    cy.visit(pageUrl)
  });
  it('should display To Do List form on load', () => {
    cy.contains("h1", "To Do List");
  });

  it('shows an empty form where write new task on load', () => {
    cy.get('.todo-form').should('be.visible').and('have.length', 1);
  });

  it('checks if the record field for a new task exists', () => {
    cy.get('input.new-todo').should('exist');
  });

  it('checks the placeholder value', () => {
    cy.get('input.new-todo').should('have.attr', 'placeholder', "What need's to be done?");
  });

  it('should allow text input', () => {
    cy.get('input.new-todo').type('Prepare homework').should('have.value', "Prepare homework");
  });
});

describe('Task management', () => {
  beforeEach(() => {
    cy.visit(pageUrl)
  });
  it('adds a new task to the list', () => {
    cy.addTask('Make a dinner');
    cy.shouldContainTask('Make a dinner');
  });

  it('persists the task after page reload', () => {
    cy.addTask('Make a dinner');
    cy.shouldContainTask('Make a dinner');
    cy.reload();
    cy.shouldContainTask('Make a dinner');
  });

  it('marks a task as done', () => {
    cy.addTask('Make a dinner');
    cy.get('.todo-list li .toggle').click();
    cy.get('.todo-list li').should('have.class', 'completed');
  });

  it('marks all tasks as done', () => {
    cy.addTask('Make a dinner');
    cy.addTask('Prepare homework');
    // Pažymime visas užduotis kaip atliktas, naudojant force:true
    // privers Cypress vykdyti veiksmą, net jei elementas yra uždengtas.
    cy.get('#toggle-all').check({ force: true });
    cy.get('.todo-list li .toggle').should('be.checked');
    cy.get('.todo-list li').should('have.class', 'completed');
  });

  it('removes a task from the list', () => {
    cy.addTask('Make a dinner');
    cy.get('.todo-list li .destroy').click({ force: true });
    cy.get('.ng-scope').should('not.contain', 'Make a dinner');
  });

  it('edits a task by double-clicking', () => {
    cy.addTask('Make a dinner');
    cy.shouldContainTask('Make a dinner');
    cy.get('.todo-list li label').dblclick();
    cy.get('.todo-list li .edit').type('Make a dinnerr{enter}');
    cy.shouldContainTask('Make a dinner');
  });

  it('removes completed tasks when "Clear completed" is clicked', () => {
    cy.addTask('Make a dinner');
    cy.get('.todo-list li .toggle').click();
    cy.get('.clear-completed').click();
    cy.get('.todo-list li').should('not.exist');
  });

  it('does not remove uncompleted tasks when "Clear completed" is clicked', () => {
    cy.addTask('Make a dinner');
    cy.addTask('Prepare homework');
    cy.get('.todo-list li').should('have.length', 2);
    cy.contains('Clear').click();
    cy.get('.todo-list li').should('have.length', 2);
    cy.get('.todo-list li').first().should('contain', 'Make a dinner');
    cy.get('.todo-list li').last().should('contain', 'Prepare homework');
  });

  it('shows all tasks when "All" is clicked', () => {
    cy.addTask('Make a dinner');
    cy.addTask('Prepare homework');
    cy.get('a[href="#/"]').click();
    cy.get('.todo-list li').should('have.length', 2);
    cy.get('.todo-list li').first().should('contain', 'Make a dinner');
    cy.get('.todo-list li').last().should('contain', 'Prepare homework');
  });

  it('shows only active tasks', () => {
    cy.addTask('Make a dinner');
    cy.get('.todo-list li .toggle').click();
    cy.get('.todo-list li').should('have.class', 'completed');
    cy.addTask('Prepare homework');
    cy.get('a[href="#/active"]').click();
    cy.get('.todo-list li').should('have.length', 1).and('contain', 'Prepare homework');
  });

  it('removes all tasks from the list when "Completed" is pressed', () => {
    cy.addTask('Make a dinner');
    cy.addTask('Prepare homework');
    cy.addTask('Prepare homework');
    cy.get('a[href="#/completed"]').click();
    cy.get('.todo-list li').should('have.length', 0);
  });

  it("does not remove unmarked tasks when 'Completed' is pressed", () => {
    cy.addTask('Make a dinner');
    cy.addTask('Prepare homework');
    cy.addTask('Prepare breakfast');
    cy.get('.todo-list li .toggle').click({ multiple: true });
    cy.get('a[href="#/completed"]').click();
    cy.get('.todo-list li').should('have.length', 3);
  });
});