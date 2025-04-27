document.getElementById('fetchUsers').addEventListener('click', () => {
    fetch('/users')
      .then(response => response.json())
      .then(users => {
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear previous content
        users.forEach(user => {
          const p = document.createElement('p');
          p.textContent = `Username: ${user.username}, Email: ${user.email}`;
          userList.appendChild(p);
        });
      })
      .catch(error => console.error('Error fetching users:', error));
  });