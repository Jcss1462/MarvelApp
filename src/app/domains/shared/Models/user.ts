export interface NewUser {
    email : string;
    name : string;
    cc : number;
    password : string;
}

export interface LogInUser {
    email : string;
    uid : string;
}

export interface UserData {
    idUsuario : number;
    nombre : string;
    identificacion : string;
    uid : string;
    correo : string;
    fechaRegistro : string;
}

