const examsCtrl = {};

const Exam = require('../models/exams'); 
const User= require('../models/User');


let date = new Date();
let today =  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/*------------------------------------------------------------------- 
        Staff tasks
-------------------------------------------------------------------*/


/************ Proceso: Generar orden de examen ************/  

//Find user by identification
examsCtrl.findUserByIdentificationForm = (req, res)=>{
    res.render('exams/staff/findUserByIdentification');
}

examsCtrl.findUserByIdentification = async (req, res)=>{
    const { identification } = req.body;
    const pList = await User.find({identification});
    res.render('exams/staff/seeAllUserAdmin', {pList})        
}

// Generar orden de examen
examsCtrl.CreateNewExam = async (req, res) => {
    const {date_of_exam, hour_of_exam, name, lastName, identification, user, status, Dx, city, date_of_bird} = req.body; 

    const today = new Date();
    const birdDate = new Date(date_of_bird);
    let age = today.getFullYear() - birdDate.getFullYear();  
    const monthDiference = today.getMonth() - birdDate.getMonth()
    if (monthDiference < 0 || (monthDiference === 0 && today.getDate() < birdDate.getDate())) {
      age= age-1;
    } 
   
    var group;

    if (age>= 18 || age<25) {
        group = 'group 1'
    }

    if (age>= 25 || age<35) {
        group = 'group 2'
    }

    if (age>= 35 || age<45) {
        group = 'group 3'
    }

    if (age>= 45 || age<55) {
        group = 'group 4'
    }

    if (age>= 55 || age<65) {
        group = 'group 5'
    }

    if (age>= 65) {
        group = 'group 6'
    }



    const newExam = new Exam({date_of_exam, hour_of_exam, name, lastName, identification, user, status, Dx, city, date_of_bird, age, group});
    await newExam.save(); 
    res.redirect('/staff/orders');
    }; 

/************ Proceso: Visualizar ordenes de examenes ************/  

// Visualizar examenes pendientes
examsCtrl.renderCreatedOrders = async (req, res) =>{


    
    const totalPendingOrdersToday = await Exam.countDocuments({$and: [{status: "pending"},{date_of_exam: today}]}); //Cuenta de los examenes pendientes para hoy. 

    const pendingOrdersToday = await Exam.find({$and: [{status: "pending"},{date_of_exam: today}]}).sort({date_of_exam: 1});

    const pendingExams = await Exam.find({status: "pending"}).lean().sort({date_of_exam: 1});
    
    res.render('exams/staff/pendingExams', {pendingExams, totalPendingOrdersToday, pendingOrdersToday}); 
};

// Visualizar ordenes canceladas
examsCtrl.renderCanceledOrders = async (req, res) =>{
    /* Examenes cancelados para este mes */
    let date = new Date(); 
    const inicioMes = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    const endCurrentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-31`;
    const examenesCanceladosActualMes = await Exam.countDocuments({
        $and: [
            {status:"canceled"},
                {$and: [
                    {date_of_exam:{$gte: inicioMes}},
                    {date_of_exam:{$lte: endCurrentMonth}}
                    ]}
        ]
    });  


    const canceledOrders = await Exam.find({status : "canceled"}).lean();
    res.render('exams/staff/canceled-orders', {canceledOrders, examenesCanceladosActualMes}); 
};

// Mostrar ??xamenes ralizados
examsCtrl.renderDoneExam = async (req, res) =>{
    const isExamDone = await Exam.find({status:"completed"}).lean().sort({date_of_exam: -1});
    res.render('exams/staff/done-exams', {isExamDone}); 
    const usersDown = await User.find(); 
    console.log(usersDown); 
};

// Mostrar examen en particular
examsCtrl.renderDoneSingleExam = async (req, res) =>{
    const exam = await Exam.findById(req.params.id);
    res.render('exams/staff/singleExam', {exam}); 
};

/************ Proceso: Cancelar ordenes m??dicas ************/  
// PENDIENTE: Colocar las citas a las que los pacientes no asistieron

// Renderizar formulario de cancelaci??n de ordenes m??dicas
examsCtrl.cancelOrderForm = async (req, res) =>{
    const exam = await Exam.findById(req.params.id).lean();
    res.render('exams/staff/cancelOrderForm', {exam});
};

// M??todo PUT cancelaci??n de ordenes m??dicas
examsCtrl.cancelOrder = async (req, res) => {
    const {status, whyCancel} = req.body;
    await Exam.findByIdAndUpdate(req.params.id, {status, whyCancel})
    res.redirect('/exams-canceled')
};

/************ Proceso: Eliminar ordenes m??dicas ************/ 

//Listar las ordenes de examen para cancelar
examsCtrl.DeleteORdersList = async (req, res) => {
    const pendingExams = await Exam.find({status: "pending"}).lean().sort({date_of_exam: 1});
    res.render('exams/staff/deleteOrders', {pendingExams }); 
};


//Eliminar orden de examen
examsCtrl.deleteExam = async (req, res) => {
    await Exam.findByIdAndDelete(req.params.id);
    res.redirect('/staff/orders');
};


/************ Proceso: Agregar resultados m??dicos ************/ 

// Renderizar formulario de resultados de examen
examsCtrl.renderEditForm = async (req, res) => {
    const exam = await Exam.findById(req.params.id).lean();
    res.render('exams/staff/add-result', {exam});
};

// M??todo PUT para insertar resultados de examen
examsCtrl.updateExam = async (req, res) => {
    const {Result, description, status, nivel} = req.body;
    await Exam.findByIdAndUpdate(req.params.id, {Result, description, status, nivel});
    res.redirect('/exams-done');
};

// Renderizar formulario para actualizar ??ltimo examen del usuario
examsCtrl.updateLastResult = async (req, res) => {
    /* const lastExam = await Exam.find({user:req.params.user}).sort({date_of_exam: -1}).limit(1); */ 
    const lastExam = await Exam.find({user:req.params.user}).sort({updatedAt: -1}).limit(1);  /* Este es el ideal */
    console.log(lastExam);
    res.render('exams/staff/updateLastResult', {lastExam});
}

// M??todo PUT para actualizar ??ltimo examen del usuario
examsCtrl.updateLastResultPut = async (req, res) => {
    const {Result} = req.body;
    await Exam.findByIdAndUpdate(req.params.user, {Result}); 
    res.redirect('/exams-done');
}

examsCtrl.renderUserExams = async (req, res) =>{
    const exams = await Exam.find({user: req.user.id}).sort({date_of_exam: -1});
    console.log(exams);
    res.render('exams/user-exams', {exams}); 
};

/************ Proceso: Visualizar gr??ficas estadisticas ************/ 

/* Stadistics per User */
examsCtrl.renderStadisticsPerUser = async (req, res) =>{
    const personalStadistics = await Exam.aggregate([{$match:{$or: [{nivel: "alto"},{nivel: "normal"},{nivel: "bajo"}]}}, { $group: {_id: "$nivel", count: { $count: { } }}}]); 
    console.log(personalStadistics);
    res.render('exams/patient/personalStadistics', {personalStadistics});    
};

examsCtrl.renderStadisticsPerCity = async (req, res) =>{ 
    const GroupalStadistics = await Exam.aggregate([{ $group: {_id: "$city", count: { $count: { } }}}]);
    console.log(GroupalStadistics);  
    const anormalLevel2 = await Exam.aggregate([{$match:{$and:[{Result:{$lte: 5}}, {Result : {$gte: 1}}]}}, { $group: {_id: "$city", count: { $count: { } }}}]); 
    res.render('exams/patient/cityStadistics', {GroupalStadistics, anormalLevel2});    
};

examsCtrl.renderStadisticsPerAge = async (req, res) =>{
    const ageStadistics = await Exam.aggregate([{$match:{status:"completed"}}, { $group: {_id: "$group", count: { $count: { } }}}]);   
    console.log(ageStadistics);
    res.render('exams/patient/ageStadistics', {ageStadistics});    
};  

examsCtrl.generalStadistics = async (req, res) =>{ 


    /* N??mero total de examanes realizados desde el primer registro*/
    let date = new Date();
    const totalCompletedexams = await Exam.countDocuments({status: "completed"}); 
    console.log("Examenes realizados: ", totalCompletedexams); 
    /* NOTA: ESTA FUNCI??N NO SE MUESTRA TODAV??A EN LA PLATAFORMA */

    /* Examenes completados en el mes anterior */
    const inicioMesAnterior = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}-01`;
    const finMesAnterior = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}-30`;
    const totalCompletedexamsPreviousMonth = await Exam.countDocuments({
        $and: [
            {status:"completed"},
                {$and: [
                    {date_of_exam:{$gte: inicioMesAnterior}},
                    {date_of_exam:{$lte: finMesAnterior}}
                ]}
        ]
    }); 

            /*------- Lo que viene en esta pesta??a -------*/

    /* Muestra el total de pacientes */
    const totalPatients = await User.countDocuments({role : "Paciente"}); 

    /* Total de ordenes pendientes */
    const totalPendingOrders = await Exam.countDocuments({status: "pending"}); 
    /* NOTA: Evaluar en qu?? intervalos de tiempo se va a mostrar la informaci??n, se recomienda mostrar el mes */

    /* Examenes realizados este mes */
    const inicioMes = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    const endCurrentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-31`;
    const totalCompletedexamsCurrentMonth = await Exam.countDocuments({$and: [{status: "completed"}, {$and: [{updatedAt:{$gte: inicioMes}}, {updatedAt:{$lte:endCurrentMonth}}]}]});  

    /* N??mero de ordenes realizadas este mes, independientemente del estado */
    const totalOrders = await Exam.countDocuments({
        $and: [
            {date_of_exam:{$gte: inicioMes}},
            {date_of_exam:{$lte:endCurrentMonth}}
        ] 
    }); 


    /* N??mero de examenes cancelados programados para este mes */ 
    const examenesCanceladosActualMes = await Exam.countDocuments({
        $and: [
            {status:"canceled"},
                {$and: [
                    {date_of_exam:{$gte: inicioMes}},
                    {date_of_exam:{$lte: endCurrentMonth}}
                    ]}
        ]
    }); 

    /* N??mero de ordenes canceladas desde el d??a 0 */
    const examenesCanceladosTotal = await Exam.countDocuments({status:"canceled"});   

    res.render('exams/patient/generalStadistics', 
        {totalPatients, 
        totalPendingOrders, 
        totalCompletedexamsCurrentMonth, 
        totalCompletedexamsPreviousMonth, 
        examenesCanceladosActualMes, 
        examenesCanceladosTotal, 
        totalOrders});    
        
};  



module.exports = examsCtrl;

