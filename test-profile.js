async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'kadamyash@gmail.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        
        if (!loginRes.ok) throw new Error(loginData.message);
        
        const token = loginData.token;
        console.log('Login success');
        
        const res = await fetch('http://localhost:5000/api/user/profile', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name: 'Yash Kadam', age: 40, gender: 'Male', password: '' })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        console.log('Profile update success:', data);
        
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();
