import { createTheme, responsiveFontSizes } from '@material-ui/core/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            dark: '#004ba0',
            light: '#63a4ff'
        },
        secondary: {
            main: '#0084b4',
            dark: '#005784',
            light: '#56b4e6'
        },
        text: {
            //secondary: '#00b7eb'
            secondary: '#008fb8'
        }
    },
    overrides: {
        MuiSwitch: {
            root: {
                fontSize: '36px',
                height: '40px'
            }
        },
        MuiFormControlLabel: {
            label: {
                color: '#616161'
            }
        },
        MuiToolbar: {
            root: {
                display: 'flex',
                justifyContent: 'flex-end'
            }
        },
        MuiButton: {
            root: {
                minWidth: '32px'
            }
        },
        MuiTypography: {
            h3: {
                color: '#616161',
                fontFamily: '"Montserrat", sans-serif'
            },
            h4: {
                color: '#616161',
                fontFamily: '"Montserrat", sans-serif'
            },
            h5: {
                color: '#616161',
                fontFamily: '"Montserrat", sans-serif'
            },
            h6: {
                color: '#616161',
                fontFamily: '"Montserrat", sans-serif'
            },
            subtitle1: {
                color: '#616161'
            }
        }
    }
})

const muiTheme = responsiveFontSizes(theme, { factor: 3 }) // default is 2

export default muiTheme
