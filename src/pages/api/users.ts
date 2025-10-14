import db from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: any, res: any) {
  try {
    const { method } = req;
    switch (method) {
      case 'GET': {
        try {
          const data = await db.users.findMany();
          res.status(200).json(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          res
            .status(500)
            .json({ error: 'An error occurred while fetching data' });
        }
        break;
      }

      case 'POST': {
        const { name, email, password } = req.body;

        // Periksa apakah semua data ada
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        try {
          // Cek jika email sudah ada
          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await db.users.create({
            data: {
              name,
              email,
              password: hashedPassword,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });

          res.status(201).json(user);
        } catch (error) {
          console.error('Error creating user:', error);
          res
            .status(500)
            .json({ error: 'An error occurred while creating user' });
        }
        break;
      }

      case 'PUT': {
        const { id } = req.query;
        const { name, email, password } = req.body;

        try {
          if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
          }

          // Hash password if provided
          const updatedData: any = {
            name,
            email,
          };

          if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
          }

          const updatedUser = await db.users.update({
            where: { id: parseInt(id) },
            data: updatedData,
          });

          res.status(200).json(updatedUser);
        } catch (error) {
          console.error('Error updating user:', error);
          res
            .status(500)
            .json({ error: 'An error occurred while updating user' });
        }
        break;
      }

      case 'DELETE': {
        const { id } = req.query;

        try {
          if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
          }

          await db.users.delete({
            where: { id: parseInt(id, 10) },
          });

          res
            .status(200)
            .json({ message: `User with ID ${id} deleted successfully` });
        } catch (error) {
          console.error('Error deleting user:', error);
          res
            .status(500)
            .json({ error: 'An error occurred while deleting user' });
        }
        break;
      }

      default: {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
