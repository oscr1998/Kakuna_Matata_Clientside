describe('User Connection to LocalHost', () => {
    it('Connects to App', () => {
      cy.visit('http://localhost:3000/')
    })

    it('Retrieves data from LocalHost', () => {
        cy.get('body')
      })
})
