document.addEventListener('DOMContentLoaded', () => {
    const userContainer = document.getElementById('user-container');
    const addUserForm = document.getElementById('add-user-form');
    const updateUserForm = document.getElementById('update-user-form');
    let apiUrl = 'http://localhost:3001';

    addUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;

        try {
            const response = await fetch(`${apiUrl}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name: firstName, last_name: lastName })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const newUser = await response.json();
            console.log('New user added:', newUser);
            fetchUserDataAndGenerateTable();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    });

    async function fetchUserDataAndGenerateTable() {
        try {
            const response = await fetch(`${apiUrl}/users`);

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            console.log('Data received:', data);

            if (data.data && Array.isArray(data.data)) {
                let tableHTML = `
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.data.forEach(user => {
                    tableHTML += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${new Date(user.createdAt).toLocaleString()}</td>
                            <td>${new Date(user.updatedAt).toLocaleString()}</td>
                            <td>
                                <button class="btn btn-success update" data-bs-toggle="modal updatemodel" data-bs-target="#updateUserModal" data-id="${user.id}">Edit</button>
                                <button class="btn btn-danger delete" data-id="${user.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                userContainer.innerHTML = tableHTML;

                // Add event listeners after generating the table
                document.querySelectorAll('.update').forEach(button => {
                    button.addEventListener('click', async () => {
                        const userId = button.getAttribute('data-id');
                        console.log('Update clicked for user ID:', userId);
                        await updateUser(userId);
                        await console.log("entered")
                    });
                });

                document.querySelectorAll('.delete').forEach(button => {
                    button.addEventListener('click', async () => {
                        const userId = button.getAttribute('data-id');
                        console.log('Delete clicked for user ID:', userId);
                        await deleteUser(userId);
                    });
                });
            } else {
                userContainer.innerHTML = '<p>No user data found.</p>';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            userContainer.innerHTML = `<p>Failed to load user data: ${error.message}</p>`;
        }
    }

    async function updateUser(userId) {
        console.log("entered update user");
    try {
        const response = await fetch(`${apiUrl}/user/${userId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const userData = await response.json();
        console.log(userData.data.first_name);

        document.getElementById('update-user-id').value = userId;
        document.getElementById('update-first-name').value = userData.data.first_name;
        document.getElementById('update-last-name').value = userData.data.last_name;

        const modal = new bootstrap.Modal(document.getElementById('updateUserModal'));
        modal.show();
    } catch (error) {
        console.error('Error updating user:', error);
    }
    }

    updateUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = document.getElementById('update-user-id').value;
        const firstName = document.getElementById('update-first-name').value;
        const lastName = document.getElementById('update-last-name').value;

        try {
            const response = await fetch(`${apiUrl}/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name: firstName, last_name: lastName })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            console.log('Update successful:', data);
            fetchUserDataAndGenerateTable();

            const modal = new bootstrap.Modal(document.getElementById('updateUserModal'));
            modal.hide();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    });

    async function deleteUser(userId) {
        try {
            const response = await fetch(`${apiUrl}/user/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            console.log('Delete successful:', data);
            fetchUserDataAndGenerateTable();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    fetchUserDataAndGenerateTable();
});
