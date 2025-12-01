import React, { useState, useEffect } from 'react';
import Encabezado from '../Encabezado';
import Opcion from './Opcion';


export default function Carrusel(props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const items = [
        {
            altText: 'Slide 1',
            caption: 'Slide 1',
            key: 1,
            src: 'https://preview.redd.it/qs7saumuwlhx.jpg?auto=webp&s=40ae8600517476dcb6b5bc9efd0e13e9b5df1ec7'
        },
        {
            altText: 'Slide 2',
            caption: 'Slide 2',
            key: 2,
            src: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/12/isekai-anime-2024.jpg'
        },
        {
            altText: 'Slide 3',
            caption: 'Slide 3',
            key: 3,
            src: 'https://i0.wp.com/22minutoscon.com/wp-content/uploads/2023/07/Diseno-sin-titulo.jpg'
        },
        {
            altText: 'Slide 4',
            caption: 'Slide 4',
            key: 4,
            src: 'https://www.cultture.com/pics/2024/08/clasificacion-de-las-10-mejores-portadas-de-manga-de-demon-slayer-0.webp'
        },
        {
            altText: 'Slide 5',
            caption: 'Slide 5',
            key: 5,
            src: 'https://wallpapers.com/images/featured/venom-comic-book-dqodyn1w71re3jkd.jpg'
        },
        {
            altText: 'Slide 5',
            caption: 'Slide 5',
            key: 6,
            src: 'https://i.blogs.es/f5e519/batman_deadpool_1_cover_dan_mora/1366_521.jpeg'
        }
        ,
        {
            altText: 'Slide 5',
            caption: 'Slide 5',
            key: 7,
            src: 'https://www.elindependiente.com/wp-content/uploads/2023/07/libros-2023-lunes10j.jpg'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === items.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',

            }}>
                <img
                    src={items[currentIndex].src}
                    alt={items[currentIndex].altText}
                    style={{
                        width: '100%',
                        height: '320px',
                        // Ajusta sin recortar ni fondos
                    }}
                />
            </div>
        </div>
    );
}