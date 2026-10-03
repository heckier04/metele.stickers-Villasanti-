import React from 'react';
import SubCategories from '../componentes/SubCategories';
import {
  PawPrint,
  Tv,
  Dumbbell,
  Music,
  Film,
  Gamepad2,
  Users,
  Wand2,
  Flag,
  Laugh,
  CircleDot,
  Trophy,
  Sparkles,
  HelpCircle,
  Mic2,
  Globe,
  Shield,
  Donut,
  Castle,
} from 'lucide-react';

const Categories = () => {
  // listing only sticker categories for the /categorias page
  const categories = [
    { name: 'Animales', path: '/category/animales', icon: PawPrint, description: 'Stickers de mascotas y fauna' },
    { name: 'Anime', path: '/category/anime', icon: Tv, description: 'Sticker de tus series de anime favoritas' },
    { name: 'Deportes', path: '/category/deportes', icon: Dumbbell, description: 'Temática deportiva' },
    { name: 'Música', path: '/category/musica', icon: Music, description: 'Stickers musicales' },
    { name: 'peliculas y series', path: '/category/peliculas y series', icon: Film, description: 'Tus películas preferidas en sticker' },
    { name: 'GAMER', path: '/category/GAMER', icon: Gamepad2, description: 'Gamer vibes' },
    { name: 'animados', path: '/category/animados', icon: Users, description: 'Personajes icónicos' },
    { name: 'Harry Potter', path: '/category/harry potter', icon: Wand2, description: 'Magia y hechicería' },
    { name: 'Argentina', path: '/category/argentina', icon: Flag, description: 'Orgullo nacional' },
    { name: 'Memes Argentina', path: '/category/memes-argentina', icon: Laugh, description: 'Memes clásicos argentinos' },
    { name: 'Futbol', path: '/category/futbol', icon: CircleDot, description: 'Stickers de clubes' },
    { name: 'Coronados de Gloria', path: '/category/coronados-gloria', icon: Trophy, description: 'Héroes laureados' },
    { name: 'Aesthetic', path: '/category/aesthetic', icon: Sparkles, description: 'Diseños estéticos' },
    { name: 'Random', path: '/category/random', icon: HelpCircle, description: 'Sorpresas y curiosidades' },
    { name: 'Música Nacional', path: '/category/musica-nacional', icon: Mic2, description: 'Lo mejor de la música local' },
    { name: 'Música Internacional', path: '/category/musica-internacional', icon: Globe, description: 'Hits globales' },
    { name: 'MARVEL-DC', path: '/category/MARVEL-DC', icon: Shield, description: 'Superhéroes' },
    { name: 'Los Simpson', path: '/category/los simpsons', icon: Donut, description: 'La familia amarilla más famosa' },
    { name: 'Disney', path: '/category/disney', icon: Castle, description: 'Clásicos y personajes de Disney' },
  ];

  return (
    <SubCategories
      title="Categorías de Productos"
      categories={categories}
    />
  );
};

export default Categories;