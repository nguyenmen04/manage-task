describe('Task Management Flow', () => {
  beforeEach(() => {
    // Để test Task, trước tiên phải Login
    cy.visit('/login')
    cy.get('input[type="text"]').type('testuser')
    cy.get('input[type="password"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should create a new task successfully', () => {
    // 1. Nhập tiêu đề task
    const taskName = 'Học Automation Test với Cypress'
    cy.get('input[placeholder="What needs to be done?"]').type(taskName)

    // 2. Chọn mức độ ưu tiên
    cy.get('select').select('High Priority')

    // 3. Click Add Task
    cy.contains('button', 'Add Task').click()

    // 4. Kiểm tra Toast hiển thị (react-hot-toast)
    cy.contains('Task created successfully').should('be.visible')

    // 5. Kiểm tra bảng danh sách có chứa task vừa tạo không
    cy.get('table').contains(taskName).should('be.visible')
    cy.get('table').contains('High').should('be.visible')
  })

  it('should mark a task as completed', () => {
    // Tìm dòng chứa Task vừa tạo, tìm nút check và click
    cy.contains('table tr', 'Học Automation Test với Cypress')
      .find('button')
      .first()
      .click()

    // Kiểm tra Toast hiện lên
    cy.contains('Task completed!').should('be.visible')
  })
})
