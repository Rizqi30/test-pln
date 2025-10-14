import db from "@/lib/db";
import moment from "moment";

export default async function handler(req: any, res: any) {
  try {
    const { method } = req;

    switch (method) {
      case "GET": {
        const { user_id, type, month } = req.query;

        // Validasi apakah user_id tersedia
        if (!user_id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        // Konversi user_id ke angka
        const parsedUserId = parseInt(user_id, 10);

        // Validasi format bulan (opsional)
        if (month && !/^(0[1-9]|1[0-2])$/.test(month)) {
          return res
            .status(400)
            .json({ error: 'Month must be a string in the format "01"-"12"' });
        }

        // Hitung rentang tanggal berdasarkan bulan jika ada
        let startDate, endDate;
        if (month) {
          const year = moment().year(); // Tahun saat ini
          startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
          endDate = moment(`${year}-${month}-01`).endOf("month").toDate();
        }

        try {
          let data;

          if (type === "projects") {
            // Query untuk mendapatkan projects dari user_id
            data = await db.projects.findMany({
              where: {
                worklogs: {
                  some: {
                    user_id: parsedUserId,
                    ...(month && {
                      work_date: {
                        gte: startDate,
                        lte: endDate,
                      },
                    }),
                  },
                },
              },
            });
          } else {
            // Query data worklogs berdasarkan user_id
            data = await db.worklogs.findMany({
              where: {
                user_id: parsedUserId,
                ...(month && {
                  work_date: {
                    gte: startDate,
                    lte: endDate,
                  },
                }),
              },
              include: {
                projects: true,
                users: true,
              },
              orderBy: {
                work_date: "asc",
              },
            });
          }

          // Jika tidak ada data, kembalikan array kosong
          if (!data || data.length === 0) {
            return res.status(200).json([]);
          }

          return res.status(200).json(data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching data" });
        }
      }

      case "POST": {
        const { user_id, project_id, work_date, hours_worked } = req.body;

        // Validasi input
        if (
          typeof user_id === "undefined" ||
          typeof project_id === "undefined" ||
          typeof work_date === "undefined" ||
          typeof hours_worked === "undefined"
        ) {
          return res.status(400).json({
            error:
              "user_id, project_id, work_date, and hours_worked are required",
          });
        }

        const parsedUserId = parseInt(user_id, 10);
        const parsedProjectId = parseInt(project_id, 10);
        const parsedWorkDate = new Date(work_date);
        const parsedHoursWorked = parseFloat(hours_worked);

        // Validasi hours_worked minimal 0
        if (isNaN(parsedHoursWorked) || parsedHoursWorked < 0) {
          return res.status(400).json({
            error: "hours_worked must be a number and at least 0",
          });
        }

        try {
          // Hitung total jam kerja untuk user_id pada tanggal tertentu
          const totalHoursForDay = await db.worklogs.aggregate({
            _sum: {
              hours_worked: true,
            },
            where: {
              user_id: parsedUserId,
              work_date: parsedWorkDate,
            },
          });

          const currentTotalForDay = totalHoursForDay._sum.hours_worked || 0;

          // Hitung total jam kerja untuk user_id pada proyek tertentu di tanggal tertentu
          const totalHoursForProject = await db.worklogs.aggregate({
            _sum: {
              hours_worked: true,
            },
            where: {
              user_id: parsedUserId,
              project_id: parsedProjectId,
              work_date: parsedWorkDate,
            },
          });

          const currentTotalForProject =
            totalHoursForProject._sum.hours_worked || 0;

          // Validasi apakah total jam pada proyek tertentu melebihi batas 8 jam
          if (currentTotalForProject + parsedHoursWorked > 8) {
            return res.status(400).json({
              error:
                "Total hours worked for this project cannot exceed 8 hours",
            });
          }

          // Validasi apakah total jam kerja pada hari itu melebihi batas 16 jam
          if (currentTotalForDay + parsedHoursWorked > 16) {
            return res.status(400).json({
              error: "Total hours worked for this day cannot exceed 16 hours",
            });
          }

          // Simpan data baru
          const newWorklog = await db.worklogs.create({
            data: {
              user_id: parsedUserId,
              project_id: parsedProjectId,
              work_date: parsedWorkDate,
              hours_worked: parsedHoursWorked,
              updated_at: new Date(),
            },
          });

          return res.status(201).json(newWorklog);
        } catch (error) {
          console.error("Error creating worklog:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while creating worklog" });
        }
      }

      case "DELETE": {
        const { id } = req.query;

        // Validasi apakah id tersedia
        if (!id) {
          return res.status(400).json({ error: "ID is required" });
        }

        // Konversi id ke angka
        const parsedId = parseInt(id, 10);

        try {
          // Hapus data worklog berdasarkan id
          const deletedWorklog = await db.worklogs.deleteMany({
            where: {
              id: parsedId,
            },
          });

          return res.status(200).json(deletedWorklog);
        } catch (error) {
          console.error("Error deleting worklog:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while deleting worklog" });
        }
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
