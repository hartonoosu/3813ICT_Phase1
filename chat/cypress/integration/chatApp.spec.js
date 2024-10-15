describe('Chat App End-to-End Tests', () => {
    it('should navigate to the login page and log in successfully', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/account');
    });
  
    it('should join a chat and send a message', () => {
      cy.visit('/chat');
      cy.get('select#groupSelect').select('default_group');
      cy.get('select#channelSelect').select('general');
      cy.get('input[name="currentMessage"]').type('Hello World');
      cy.get('button').contains('Send').click();
      cy.get('.chat-window').should('contain', 'Hello World');
    });
  });
  