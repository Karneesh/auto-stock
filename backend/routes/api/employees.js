const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Employee = require('../../models/Employee');

// Seed Default Employee (employee123)
router.post('/seed', async (req, res) => {
    try {
        let existingEmployee = await Employee.findOne({ email: 'employee123@company.com' });

        if (!existingEmployee) {
            const hashedPassword = await bcrypt.hash('employee123', 10);
            const newEmployee = new Employee({
                name: 'Default Employee',
                email: 'employee123@company.com',
                password: hashedPassword,
                role: 'employee',
                isActive: true
            });

            await newEmployee.save();
            return res.json({ message: 'Default employee created successfully!' });
        }

        res.json({ message: 'Default employee already exists.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
