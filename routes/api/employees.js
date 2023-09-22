const express = require('express');
const employeesControler = require('../../controllers/employeesController')
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');



router.get('/', employeesControler.getAllEmployees)
router.get('/:id', employeesControler.getEmployee)
router.delete('/', verifyRoles(ROLES_LIST.Admin), employeesControler.deleteEmployee)
router.post('/',verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControler.createNewEmployee)
router.put('/', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControler.updateEmployee)




/* 
router.route('/:id')
    .get((req, res) =>{
        res.json({"id" : req.params.id})
    }); */




module.exports = router;