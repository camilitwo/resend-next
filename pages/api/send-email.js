import fetch from 'node-fetch';

export default async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { nombre, telefono, email, mensaje } = req.body;

    const contenido_html = `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <div style="background-color: #0066ff; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="margin: 0;">Mensaje de Contacto</h1>
            </div>
            <div style="padding: 20px; background-color: #fff; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; color: #333;">
                    <strong>Nombre:</strong> ${nombre}
                </p>
                <p style="font-size: 16px; color: #333;">
                    <strong>Teléfono:</strong> ${telefono}
                </p>
                <p style="font-size: 16px; color: #333;">
                    <strong>Email:</strong> ${email}
                </p>
                <p style="font-size: 16px; color: #333;">
                    <strong>Mensaje:</strong> ${mensaje}
                </p>
            </div>
        </div>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer re_SNBRPBR6_J5CPjRzadLJXa3AVPuu1836D',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: "camilo.igv@gmail.com",
                subject: nombre + " te ha enviado un mensaje de contacto",
                html: contenido_html
            })
        });

        if (response.ok) {
            return res.status(200).json({ message: '¡Correo enviado exitosamente!' });
        } else {
            const errorText = await response.text();
            console.error('Error en la respuesta:', errorText);
            return res.status(500).json({ error: 'Hubo un problema al enviar el correo.', details: errorText });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Hubo un problema al enviar el correo.' });
    }
};
