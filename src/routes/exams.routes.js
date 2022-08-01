const {Router} = require('express');
const router = Router(); 

const {
    findUserByIdentificationForm, 
    findUserByIdentification,
    CreateNewExam,
    renderCreatedOrders, 
    renderEditForm, 
    updateExam, 
    renderDoneExam,
    cancelOrderForm,
    cancelOrder,
    renderCanceledOrders,
    deleteExam,  
    renderUserExams,  
    renderStadisticsPerUser, 
    renderStadisticsPerCity, 
    renderStadisticsPerAge, 
    generalStadistics, 
    renderDoneSingleExam, 
    updateLastResult, 
    updateLastResultPut, 
    DeleteORdersList} = require('../controllers/exams.controllers'); 

const {isAuthenticated, isLab_Staff, isAdmin, isPhysician, isLab_Staff_Admin} = require('../helpers/auth');

/*------------------------------------------------------------------- 
        Staff tasks
-------------------------------------------------------------------*/

/************ Proceso: Generar orden de examen ************/  

//Find user by identification
router.get('/exams/findUserByIdentification', findUserByIdentificationForm);
router.post('/exams/findUserByIdentification', findUserByIdentification);

// Método POST para guardar la orden de examen
router.post('/exams/new-exam', CreateNewExam);

//Visualizar orden de los examenes (Examenes que no se han tomado)
router.get('/staff/orders', renderCreatedOrders);

//Agregar resultados médicos
router.get('/exams/edit/:id', renderEditForm);
router.put('/exams/edit/:id', updateExam);

// Mostrar examenes realizados
router.get('/exams-done', isPhysician, renderDoneExam);

// Mostrar examen en particular realizados
router.get('/exams/exam/:id', renderDoneSingleExam);

// Mostrar ordenes canceladas
router.get('/exams-canceled', renderCanceledOrders);

//Cancelar ordenes médicas
router.get('/exams/cancelOrder/:id', cancelOrderForm);
router.put('/exams/cancelOrder/:id', cancelOrder);

//Actualizar último resultado en el documento de users
router.get('/exams/updateLastResult/:user', updateLastResult);
router.put('/exams/updateLastResult/:user', updateLastResultPut);


/* *********** */

// Get patient exams
router.get('/exams-patient', renderUserExams);


//Visualizar orden de los examenes con la opción de eliminarlos (Examenes que no se han tomado)
router.get('/staff/delete/orders', DeleteORdersList);

//Delete Exams
router.delete('/exams/staff/delete/:id', deleteExam);

/*****************  Gráficas *****************/
router.get('/exams/stadistics/user', renderStadisticsPerUser);

router.get('/exams/stadistics/examsPerCity', renderStadisticsPerCity);

router.get('/exams/stadistics/examsPerAge', renderStadisticsPerAge);

/*****************  Estadisticas *****************/

router.get('/exams/stadistics/general', generalStadistics);



module.exports = router;