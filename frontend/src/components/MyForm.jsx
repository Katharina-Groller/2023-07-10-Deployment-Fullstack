import { useFormik } from 'formik';
import * as Yup from 'yup';

const MyForm = () => {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Dieses Feld ist erforderlich'),
            password: Yup.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein').required('Dieses Feld ist erforderlich'),
        }),
        onSubmit: values => {
            // Daten an den Server senden, wenn die Validierung erfolgreich ist
            fetch('https://fullstack-deployment-backend.onrender.com/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
                .then(response => response.json())
                .then(data => {
                    // Verarbeitung der Antwort vom Server
                    console.log(data);
                })
                .catch(error => {
                    // Fehlerbehandlung
                    console.error('Fehler beim Senden der Daten:', error);
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Benutzer</label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    {...formik.getFieldProps('username')}
                />
                {formik.touched.username && formik.errors.username && <div className="invalid-feedback">{formik.errors.username}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Passwort</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Anmelden</button>
        </form>
    );
};

export default MyForm;
