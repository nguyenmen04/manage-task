describe('Registration Flow', () => {
  it('should show error when passwords do not match', () => {
    cy.visit('/register')
    
    cy.get('input[placeholder="Choose a username"]').type('newuser')
    cy.get('input[placeholder="Create a password"]').type('password123')
    cy.get('input[placeholder="Confirm your password"]').type('password456') // Cố tình gõ sai
    
    cy.get('button[type="submit"]').click()
    
    // Phải hiển thị lỗi do mình vừa code ở Frontend
    cy.get('.text-red-600').should('contain', 'Passwords do not match')
  })

  it('should show error when username already exists', () => {
    // 1. Dùng API ngầm tạo trước 1 user tên là 'testuser'
    cy.request({
      method: 'POST',
      url: '/api/v1/auth/register',
      body: { username: 'testuser', password: '123456' },
      failOnStatusCode: false
    })

    // 2. Lên giao diện web cố tình đăng ký lại tên 'testuser'
    cy.visit('/register')
    cy.get('input[placeholder="Choose a username"]').type('testuser')
    cy.get('input[placeholder="Create a password"]').type('123456')
    cy.get('input[placeholder="Confirm your password"]').type('123456')
    
    cy.get('button[type="submit"]').click()
    
    // Backend sẽ chửi và Frontend phải hiện lỗi
    cy.get('.text-red-600').should('contain', 'Tên người dùng đã tồn tại')
  })

  it('should successfully register and redirect to login', () => {
    // Tạo random username để không bao giờ bị trùng khi test nhiều lần
    const randomUsername = `user_${Math.floor(Math.random() * 100000)}`
    
    cy.visit('/register')
    cy.get('input[placeholder="Choose a username"]').type(randomUsername)
    cy.get('input[placeholder="Create a password"]').type('strongpass123')
    cy.get('input[placeholder="Confirm your password"]').type('strongpass123')
    
    cy.get('button[type="submit"]').click()
    
    // Phải chuyển hướng về trang login
    cy.url().should('include', '/login')
  })
})
