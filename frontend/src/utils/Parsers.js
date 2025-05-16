export const dateStringToDateText = (dateString) =>{
    const date = new Date(dateString);
    console.log(dateString);

    const day = date.getDate();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                     "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const fullDate = `${day} ${month} ${year}`;

    return fullDate;
};