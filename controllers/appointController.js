const { Appointment, User, Intervention } = require("../models");
const { roleId, userId } = require("../models/user");
// const { QueryTypes } = require('sequelize');
const appointController = {};

//crear nueva cita
appointController.createAppointment = async (req, res) => {
    try {
        const { date, interventionId, details, patientId, dentistId, results } = req.body;
        //tomo el role y user id para su validacion

        //CONDICIONALES
        // los usuarios con roleId igual a 3 pueden crear citas con su propio userId
        if (roleId === 3 && patientId !== userId) {
            //mensaje de error si trata de implementar otro usuario
            return res.json({
                success: false,
                message: "You can only create appointments for yourself",
            });
        }
        // los usuarios con roleId igual a 2 pueden crear citas tanto para 
        //pacientes como para otros doctores => deben proporcionar un patientId valido
        if (roleId === 2 && !patientId) {

            return res.json({
                success: false,
                message: "Patient ID is required for dentists",
            });
        }
        //solo se puede colocar un patientId => roleId = 3
        if (patientId) {
            const patient = await User.findOne({
                where: {
                    id: patientId,
                    roleId: 3
                }
            });
            if (!patient) {
                return res.json({
                    success: false,
                    message: "Invalid patient ID",
                });
            }
        }
        //solo se puede colocar un dentistId => roleId = 2
        if (dentistId) {
            const dentist = await User.findOne({
                where: {
                    id: dentistId,
                    roleId: 2
                }
            });
            if (!dentist) {
                return res.json({
                    success: false,
                    message: "Invalid dentist ID",
                });
            }
        }
        //parametros de la nueva cita
        const newAppointment = await Appointment.create(
            {
                date,//'2023-06-07T14:30:00'
                interventionId,
                details,
                patientId,
                dentistId
            }
        );
        return res.json({
            success: true,
            message: "Appointment created",
            data: newAppointment
        });
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Appointment cant be created",
                error: error
            }
        )
    }
}

//actualizar una cita
appointController.updateAppointment = async (req, res) => {
    try {
        //requerimiento de los datos
        const userId = req.userId;
        const roleId = req.roleId;
        const appointmentId = req.params.id;
        //confirmacion de la existencia de la cita
        const appointmentExist = await Appointment.findByPk(appointmentId);
        if (!appointmentExist) {
            return res.json({
                success: false,
                message: "Appointment doesn't exist",
            });
        }
        //datos que se requeriran desde el body
        const { date, details, results } = req.body;

        //VALIDACIONES
        // Verificar si el usuario tiene permiso para actualizar la cita
        if (roleId === 3 && appointmentExist.patientId !== userId) {
            return res.json({
                success: false,
                message: "You can only update your own appointments",
            });
        } else if (roleId === 2 && appointmentExist.dentistId !== userId) {
            return res.json({
                success: false,
                message: "You can only update appointments where you are the assigned dentist",
            });
        }
        //update de la cita en base a los datos previos
        const appointmentUpdate = await Appointment.update(
            {
                date,
                details,
                //condiciona que solo el doctor pueda rellenar este campo
                'results': roleId === 2 ? results : appointmentExist.results
            },
            {
                where: {
                    id: appointmentId
                }
            }
        );

        //console.log(appointmentUpdate);

        return res.json({
            success: true,
            message: "Appointment updated",
            data: appointmentUpdate
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Appointment can't be updated",
            error: error
        });
    }
};


// eliminar una cita
appointController.deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        const deleteAppointment = await Appointment.destroy({
            where: {
                id: appointmentId
            }
        });

        return res.json(
            {
                success: true,
                message: "Appointment deleted",
                data: deleteAppointment
            }
        );
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Appointment cant be deleted",
                error: error
            }
        )
    }
}

//obtener citas propias
appointController.getUserAppointments = async (req, res) => {
    try {

        const getUserAppointments = await Appointment.findAll({
            where: {
                patientId: userId
            }
        });

        return res.json({
            success: true,
            message: "appointments retrieved",
            data: getUserAppointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Appointments cant be retrieved",
            error: error.message
        });
    }
};

//obtener todas las citas(doctor)
appointController.getAllAppointments = async (req, res) => {
    try {

        const getAllAppointments = await Appointment.findAll();

        return res.json({
            success: true,
            message: "appointments retrieved",
            data: getAllAppointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Appointments cant be retrieved",
            error: error.message
        });
    }
};

//obtener todas las citas(doctor)
appointController.getAllUserAppointments = async (req, res) => {
    try {

        const userId = req.userId;

        const dentistAppointments = await Appointment.findAll({
            where: {
                dentistId: userId
            }
        });

        return res.json({
            success: true,
            message: "appointments retrieved",
            data: dentistAppointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Appointments cant be retrieved",
            error: error.message
        });
    }
};

// cita en detalle
appointController.getAppointmentDetails = async (req, res) => {
    try {
        const userId = req.userId;

        const appointmentId = req.params.id;
        console.log("userId:", userId);
        console.log("appointmentId:", appointmentId);


        const appointment = await Appointment.findByPk(appointmentId, {
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: [
                {
                    model: Intervention,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: User,
                    attributes: {
                        exclude: ["email", "password", "dni", "phoneNumber", "gender", "birthdate", "collegiateNumber", "roleId", "createdAt", "updatedAt"]
                    }
                }
            ],
            where: {
                id: appointmentId
            }
        });
        console.log("appointment:", appointment);
        if (!appointment || appointment.UserId !== userId) {
            console.log("Appointment not found or does not belong to the authenticated user");
            return res.json({
                success: false,
                message: "Appointment not found or does not belong to the authenticated user"
            });
        }

        return res.json({
            success: true,
            message: "Appointment details",
            data: appointment
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Appointment details could not be retrieved",
            error: error
        });
    }
};

module.exports = appointController;
