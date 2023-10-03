
# Categorias Management Web Application

This project is a web application built with Vue.js for managing categories. It provides features for adding, editing, and deleting categories through a user-friendly interface. The application communicates with a backend API to perform CRUD (Create, Read, Update, Delete) operations on categories.

## Features

- **Category Management**: Add, edit, and delete categories.
- **Validation**: Input validation for category name.
- **Data Table**: View categories in a tabular format.
- **Dialogs**: Use dialogs for adding and editing categories.
- **RESTful API**: Communicate with a RESTful API to perform CRUD operations.

## Project Structure

- **src**: Contains the main source code of the Vue.js application.
  - **assets**: Static assets like images or fonts.
  - **components**: Vue components used in the application.
  - **views**: Top-level views for different sections of the app.
  - **App.vue**: The root Vue component.
  - **main.js**: The entry point of the Vue application.
- **public**: Publicly accessible files (e.g., index.html).

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/orrrrli/ControlDeVentas.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ControlDeVentas
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure API Endpoint:

   - Open the `src/views/Categorias.vue` file.
   - Update the `axios` requests to point to your backend API.

5. Run the development server:

   ```bash
   npm run serve
   ```

6. Access the application in your web browser at `http://localhost:8080`.

## Usage

- Visit the application in your web browser.
- Use the "Nueva Categorias" button to add a new category.
- Click the "Edit" icon to edit a category.
- Click the "Delete" icon to delete a category.
- Categories are displayed in a table with sorting capabilities.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear messages.
4. Push your changes to your fork.
5. Create a pull request to the original repository.

## License

This project was created as a practice for my university, but you can use it if it is useful to someone.
