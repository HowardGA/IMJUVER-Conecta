import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import coursesRoutes from './routes/coursesRoutes.js';
import path from 'path';
import coursesCategoryRoutes from './routes/coursesCategoryRoutes.js';
import  authenticateToken from './middleware/authMiddleware.js';
import courseProgress from './routes/courseProgress.js'
import courseCrud from './routes/crudCourse.js'
import annourcementRoutes from './routes/eventRoute.js';
import ofertasRoutes from './routes/ofertasRoutes.js';
import directorioRoutes from './routes/directorioRoutes.js';
import ideaRoutes from './routes/propuestasRoutes.js'

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: ['https://imjuver-conecta-next-js.vercel.app','http://localhost:3000'], 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.json({ 
      message: 'API is running 🚀',
    });
  });


app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/courseCategory', coursesCategoryRoutes);
app.use('/api/course', coursesRoutes);
app.use('/api/progress', authenticateToken, courseProgress);
app.use('/api/course-crud', authenticateToken, courseCrud);
app.use('/api/announcements', annourcementRoutes);
app.use('/api/ofertas', ofertasRoutes);
app.use('/api/directorio', directorioRoutes);
app.use('/api/propuestas', ideaRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err);
  res.status(500).json({ message: 'Global error', error: err.message, stack: err.stack });
});
//https://imjuver-conecta-next-js.vercel.app