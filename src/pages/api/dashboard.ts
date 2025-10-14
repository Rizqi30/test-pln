import db from "@/lib/db";
import moment from "moment";

export default async function handler(req: any, res: any) {
  try {
    const { method } = req;

    switch (method) {
      case "GET": {
        const { user_id, month } = req.query;

        if (!user_id || !month) {
          return res.status(400).json({
            error: "User ID and month (01-12) are required",
          });
        }

        const parsedUserId = parseInt(user_id, 10);

        if (!/^(0[1-9]|1[0-2])$/.test(month)) {
          return res
            .status(400)
            .json({ error: 'Month must be a string in the format "01"-"12"' });
        }

        const year = moment().year();
        const startDate = moment(`${year}-${month}-01`)
          .startOf("month")
          .toDate();
        const endDate = moment(`${year}-${month}-01`).endOf("month").toDate();

        try {
          const worklogs = await db.worklogs.findMany({
            where: {
              user_id: parsedUserId,
              work_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });

          const totalProjectsWorkedOn = new Set(
            worklogs.map((log: any) => log.project_id)
          ).size;

          const completedProjects = Array.from(
            new Set(worklogs.map((log: any) => log.project_id)) // Ambil unique project_id
          ).filter((projectId) => {
            const projectLogs = worklogs.filter(
              (log: any) => log.project_id === projectId
            );

            // Hitung total jam kerja untuk proyek tersebut
            const totalHours = projectLogs.reduce(
              (sum: any, log: any) => sum + log.hours_worked,
              0
            );

            // Jumlah jam kerja yang dibutuhkan untuk proyek dianggap selesai
            const totalHoursNeeded = moment(startDate).daysInMonth() * 8; // 8 jam per hari untuk bulan tersebut

            // Hitung persentase pencapaian berdasarkan jam yang telah dikerjakan dibandingkan jam yang dibutuhkan
            const monthlyTotal = (totalHours / totalHoursNeeded) * 100;

            // Hanya proyek yang memiliki persentase 100% atau lebih yang dianggap selesai
            return monthlyTotal >= 100;
          }).length;

          const totalDaysInMonth = moment(startDate).daysInMonth();
          const workdays = worklogs.map((log: any) => log.work_date);
          const uniqueWorkdays = new Set(
            workdays.map((date: any) => moment(date).format("YYYY-MM-DD"))
          ).size;
          const totalAbsentDays = totalDaysInMonth - uniqueWorkdays;

          const totalMonthlyCompletion = Array.from(
            new Set(worklogs.map((log: any) => log.project_id)) // Ambil unique project_id
          ).reduce((total: any, projectId: any) => {
            // Filter worklogs untuk setiap project_id
            const projectLogs = worklogs.filter(
              (log: any) => log.project_id === projectId
            );

            // Hitung total jam kerja proyek
            const totalHours = projectLogs.reduce(
              (sum: any, log: any) => sum + log.hours_worked,
              0
            );

            // Total hari kerja proyek (jam kerja per hari adalah 8)
            const totalWorkDays = totalHours / 8;

            // Total kontribusi proyek untuk bulan ini dalam bentuk persentase
            const monthlyTotal =
              (totalWorkDays / moment(startDate).daysInMonth()) * 100;

            // Tambahkan kontribusi proyek ke total keseluruhan
            return total + monthlyTotal / totalProjectsWorkedOn;
          }, 0);

          // Batasi totalMonthlyCompletion hingga maksimum 100%
          const normalizedMonthlyCompletion = Math.min(
            totalMonthlyCompletion as number,
            100
          );

          // Hitung completionRate (karena target hanya 1, cukup gunakan nilai normalized)
          const completionRate = normalizedMonthlyCompletion;

          const attendanceRate =
            ((totalDaysInMonth - totalAbsentDays) / totalDaysInMonth) * 100 ||
            0;

          const dashboardData = {
            totalProjectsWorkedOn,
            totalCompletedProjects: completedProjects,
            totalAbsentDays,
            completionRate,
            attendanceRate,
          };

          return res.status(200).json(dashboardData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching data" });
        }
      }

      default: {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}
