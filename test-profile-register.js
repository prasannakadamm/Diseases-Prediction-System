async function test() {
    try {
        const rand = Math.random();
        console.log('Registering user...');
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email: 'test'+rand+'@test.com', password: 'password123' })
        });
        const regData = await regRes.json();
        
        if (!regRes.ok) throw new Error(regData.message);
        
        const token = regData.token;
        console.log('Register success');
        
        const res = await fetch('http://localhost:5000/api/user/profile', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name: 'Test User Updated', age: 40, gender: 'Male', password: '' })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        console.log('Profile update success:', data);
        
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();
