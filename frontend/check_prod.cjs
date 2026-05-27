const axios = require('axios');

async function test() {
    try {
        const payload = {
            name: 'Test Product',
            slug: 'test-product',
            description: 'Test',
            basePrice: 150000,
            categoryId: 4,
            isPublished: true,
            stockQuantity: 10
        };
        const res = await axios.post('http://localhost:8080/api/admin/products', payload, {
            // Need a token! Wait, I'll bypass security by sending a dummy user or just generating a token?
            // Actually, we don't have a token in the script easily.
        });
        console.log(res.data);
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
test();
