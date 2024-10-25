const mongoose = require('mongoose');
const Form = require('../models/form.js');

const formController = { // Added the equal sign here
    
    getPage1: (req, res) => {
        res.render("page1", {
            title: "Pick-up Information",
        });
    },

    getPage2: (req, res) => {
        res.render("page2", {
            title: "Departure Information",
        })
    },
    
    getPage3: (req, res) => {
        res.render("page3", {
            title: "Contact Information",
        })
    },

    async deleteSelected (req, res) {
        try {
            const ids = req.body.ids; 

            if (!ids) {
              return res.status(400).send('No items selected');
            }
            
            await Form.deleteMany({ _id: { $in: ids } });
            await Form.save();
        
            console.log('Form deleted successfully:', ids);
            res.redirect('back');
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = formController;