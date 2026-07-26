describe('Task Management Flow', () => {
  before(() => {
    cy.request({
      method: 'POST',
      url: '/api/v1/auth/register',
      body: { username: 'testuser', password: '123456' },
      failOnStatusCode: false
    })
  })

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

    // 5. Kiểm tra bảng Kanban có chứa task vừa tạo không (sẽ nằm ở cột TODO theo mặc định)
    cy.contains('h2', 'To Do').parent().parent().contains(taskName).should('be.visible')
    cy.contains('h2', 'To Do').parent().parent().contains('High').should('be.visible')
  })

  it('should delete a task', () => {
    // Tìm thẻ Kanban chứa Task vừa tạo, tìm nút delete và click
    cy.contains('h3', 'Học Automation Test với Cypress')
      .parent()
      .parent()
      .find('button[title="Delete Task"]')
      .first()
      .click({ force: true })

    // Kiểm tra Toast hiện lên
    cy.contains('Task deleted successfully').should('be.visible')
  })
})
