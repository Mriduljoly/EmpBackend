const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const employeeModel = require('./Models/employeeModel');
const app = express();
const PORT = 5000;
const path = require('path')

app.use(express.static(path.join(__dirname,'/build')));

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Mridul:Mridul123@cluster0.2khlvfl.mongodb.net/NempAppDb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });



// Read - Get all employees
app.get('/api/allemployees', async (req, res) => {
  try {
    const allEmployees = await employeeModel.find();
    res.json(allEmployees);
    console.log(allEmployees)
  } catch (error) {
    console.error('Failed to get employees:', error);
    res.status(500).send('Failed to get employees');
  }
});

// Create - Add a new employee
app.post('/api/addemployees', async (req, res) => {
  const {name,location,position,salary}= req.body;
  try {
    let employee = new employeeModel({
        name:name,
        position:position,
        location:location,
        salary:salary
    })
    console.log(employee)
    await employee.save()
    res.status(200).send('employee regd')
} catch (error) {
    console.error('Failed to reg emp', error);
    res.status(500).send('Failed to reg');
  }
});

// Update - Update an employee

  // Update - Update an employee
  app.put('/api/updateemployees/:id', async (req, res) => {
    const id = req.params.id;
    const { name, location, position, salary } = req.body;
  
    try {
      const updatedEmployee = await employeeModel.findByIdAndUpdate(
        id,
        {
          name: name,
          location: location,
          position: position,
          salary: salary
        },
        { new: true }
      );
  
      if (!updatedEmployee) {
        return res.status(404).send('Employee not found');
      }
  
      console.log(updatedEmployee);
      res.json(updatedEmployee);
    } catch (error) {
      console.error('Failed to update employee:', error);
      res.status(500).send('Failed to update employee');
    }
  });
  

// Delete - Delete an employee
app.delete('/api/deleteemployees/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedEmployee = await employeeModel.findByIdAndRemove(id);
     console.log(deletedEmployee)
    if (!deletedEmployee) {
      return res.status(404).send('Employee not found');
    }

    res.status(200).send('Employee deleted successfully');
  } catch (error) {
    console.error('Failed to delete employee:', error);
    res.status(500).send('Failed to delete employee');
  }
});

app.get('/*', function(req, res) { 
  res.sendFile(path.join(__dirname ,'/build/index.html')); });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
