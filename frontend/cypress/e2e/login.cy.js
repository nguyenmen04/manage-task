describe('Authentication Flow', () => {
  before(() => {
    // Tự động tạo user trước khi chạy các bài test
    cy.request({
      method: 'POST',
      url: '/api/v1/auth/register',
      body: { username: 'testuser', password: '123456' },
      failOnStatusCode: false // Bỏ qua lỗi nếu user đã tồn tại
    })
  })

  it('should successfully log in and redirect to dashboard', () => {
    // Truy cập trang đăng nhập
    cy.visit('/login')

    // Kiểm tra xem có đúng trang Login chưa
    cy.get('h1').should('contain', 'Welcome Back')

    // Điền thông tin vào form (Dùng tài khoản test)
    // Lưu ý: Tài khoản này phải được tạo trước trong DB hoặc qua giao diện Register
    // Trong bài test này ta giả định tài khoản 'testuser' với pass '123456' đã tồn tại.
    // Nếu chưa có, bạn hãy tự tạo bằng tay 1 lần trên web nhé!
    cy.get('input[type="text"]').type('testuser')
    cy.get('input[type="password"]').type('123456')

    // Click nút Sign In
    cy.get('button[type="submit"]').click()

    // Chờ 1 chút và kiểm tra xem URL có chuyển về trang chủ (/) không
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Kiểm tra xem Dashboard có hiển thị đúng không
    cy.get('h2').should('contain', 'Tasks Overview')
  })

  it('should show error on wrong credentials', () => {
    cy.visit('/login')
    cy.get('input[type="text"]').type('wronguser')
    cy.get('input[type="password"]').type('wrongpass')
    cy.get('button[type="submit"]').click()
    
    // Phải hiển thị lỗi
    cy.get('.text-red-600').should('contain', 'Sai tên đăng nhập hoặc mật khẩu')
  })
})
