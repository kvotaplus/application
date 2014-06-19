var SLIP_STATUS_UNKNOWN         = 1;
var SLIP_STATUS_WAITING         = 2;
var SLIP_STATUS_SUCCESS         = 3;
var SLIP_STATUS_FAIL            = 4;
var SLIP_STATUS_DOES_NOT_MATTER = 5;

function SlipStatusString(status){
    if (status == SLIP_STATUS_UNKNOWN)
        return "Nepoznato";
    else if (status == SLIP_STATUS_WAITING)
        return "Čeka se";
    else if (status == SLIP_STATUS_SUCCESS)
        return "Prošlo";
    else if (status == SLIP_STATUS_FAIL)
        return "Nije prošlo";
    else if (status == SLIP_STATUS_DOES_NOT_MATTER)
        return "Nije bitno";
    else
        return "Nepoznato";
}