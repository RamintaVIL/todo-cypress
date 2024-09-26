// Pasirinktina komanda, kad pridėtumėte užduotį
Cypress.Commands.add('addTask', (task) => {
    cy.get('.new-todo').type(`${task}{enter}`)
})

// Pasirinktina komanda, kad patvirtintumėte, jog užduotis yra sąraše
Cypress.Commands.add('shouldContainTask', (task) => {
    cy.contains(task).should('exist')
})