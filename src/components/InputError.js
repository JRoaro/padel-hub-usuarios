import React from 'react'; 

const InputError = ({ error }) => {
    let message = error?.message || 'Error'
    if (error?.type === 'pattern') message = 'Formato inválido'
    return <p className="text-red-500">{message}</p>
}

export default InputError;