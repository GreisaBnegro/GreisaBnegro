using System;
using System.Timers;
using System.Threading;

class PomodoroTimer
{
    enum SessionType { Pomodoro, ShortBreak, LongBreak }

    static SessionType currentSession = SessionType.Pomodoro;

    static TimeSpan pomodoroLength = TimeSpan.FromMinutes(25);
    static TimeSpan shortBreakLength = TimeSpan.FromMinutes(5);
    static TimeSpan longBreakLength = TimeSpan.FromMinutes(15);

    static TimeSpan sessionLength = pomodoroLength;
    static TimeSpan elapsed = TimeSpan.Zero;

    // FIX: fully qualify Timer to avoid ambiguity
    static System.Timers.Timer timer = new System.Timers.Timer(1000);

    static bool paused = false;

    static void Main(string[] args)
    {
        SetSession(SessionType.Pomodoro);

        timer.Elapsed += Tick;
        timer.Start();

        Console.WriteLine("Pomodoro started.");
        Console.WriteLine("Commands: p = Pomodoro, s = Short Break, l = Long Break, space = Pause/Resume, r = Reset, c = Customize, q = Quit");

        while (true)
        {
            ConsoleKeyInfo key = Console.ReadKey(true);

            switch (key.Key)
            {
                case ConsoleKey.Q:
                    return;

                case ConsoleKey.P:
                    SwitchSession(SessionType.Pomodoro);
                    break;

                case ConsoleKey.S:
                    SwitchSession(SessionType.ShortBreak);
                    break;

                case ConsoleKey.L:
                    SwitchSession(SessionType.LongBreak);
                    break;

                case ConsoleKey.Spacebar:
                    paused = !paused;
                    break;

                case ConsoleKey.R:
                    elapsed = TimeSpan.Zero;
                    break;

                case ConsoleKey.C:
                    CustomizeMenu();
                    break;
            }
        }
    }

    static void Tick(object sender, ElapsedEventArgs e)
    {
        if (paused) return;

        elapsed = elapsed.Add(TimeSpan.FromSeconds(1));

        Console.Clear();
        Console.WriteLine("SESSION: " + currentSession);
        Console.WriteLine();

        DrawProgressBar(elapsed, sessionLength);

        Console.WriteLine($"Elapsed:   {elapsed:mm\\:ss}");
        TimeSpan remaining = sessionLength - elapsed;
        if (remaining < TimeSpan.Zero) remaining = TimeSpan.Zero;

        Console.WriteLine($"Remaining: {remaining:mm\\:ss}");
        Console.WriteLine();
        Console.WriteLine("Commands: p, s, l, space=Pause, r=Reset, c=Customize, q=Quit");

        if (elapsed >= sessionLength)
        {
            Console.WriteLine("\nSession complete!");
            Console.Beep();
            paused = true;
        }
    }

    // Proper proportional conversion of elapsed time on session switch
    static void SwitchSession(SessionType newSession)
    {
        double percentElapsed = elapsed.TotalSeconds / sessionLength.TotalSeconds;

        currentSession = newSession;

        switch (newSession)
        {
            case SessionType.Pomodoro:
                sessionLength = pomodoroLength;
                break;
            case SessionType.ShortBreak:
                sessionLength = shortBreakLength;
                break;
            case SessionType.LongBreak:
                sessionLength = longBreakLength;
                break;
        }

        elapsed = TimeSpan.FromSeconds(sessionLength.TotalSeconds * percentElapsed);

        Console.WriteLine($"\nSwitched to {currentSession}, elapsed carried proportionally.");
        Thread.Sleep(400);
    }

    static void SetSession(SessionType newSession)
    {
        currentSession = newSession;
        elapsed = TimeSpan.Zero;

        switch (newSession)
        {
            case SessionType.Pomodoro:
                sessionLength = pomodoroLength;
                break;
            case SessionType.ShortBreak:
                sessionLength = shortBreakLength;
                break;
            case SessionType.LongBreak:
                sessionLength = longBreakLength;
                break;
        }

        Console.WriteLine($"Session set to {currentSession}");
    }

    static void DrawProgressBar(TimeSpan elapsed, TimeSpan total)
    {
        int width = 40;
        double progress = elapsed.TotalSeconds / total.TotalSeconds;
        if (progress > 1) progress = 1;

        int filled = (int)(progress * width);

        string bar = "[" + new string('#', filled) + new string('-', width - filled) + "]";
        Console.WriteLine(bar);
    }

    // --- CUSTOMIZATION MENU ---
    static void CustomizeMenu()
    {
        timer.Stop();
        Console.Clear();

        Console.WriteLine("=== Customize Session Lengths ===");
        Console.WriteLine("1. Change ALL session lengths");
        Console.WriteLine("2. Change ONE session");
        Console.WriteLine("3. Back");

        Console.Write("Select: ");
        string choice = Console.ReadLine();

        switch (choice)
        {
            case "1":
                CustomizeAll();
                break;
            case "2":
                CustomizeSpecific();
                break;
        }

        timer.Start();
    }

    static void CustomizeAll()
    {
        Console.Write("Work minutes: ");
        pomodoroLength = TimeSpan.FromMinutes(int.Parse(Console.ReadLine()));

        Console.Write("Short break minutes: ");
        shortBreakLength = TimeSpan.FromMinutes(int.Parse(Console.ReadLine()));

        Console.Write("Long break minutes: ");
        longBreakLength = TimeSpan.FromMinutes(int.Parse(Console.ReadLine()));

        Console.WriteLine("All durations updated!");
    }

    static void CustomizeSpecific()
    {
        Console.WriteLine("1. Work");
        Console.WriteLine("2. Short Break");
        Console.WriteLine("3. Long Break");

        Console.Write("Select: ");
        string choice = Console.ReadLine();

        Console.Write("Enter new minutes: ");
        int minutes = int.Parse(Console.ReadLine());

        switch (choice)
        {
            case "1":
                pomodoroLength = TimeSpan.FromMinutes(minutes);
                break;
            case "2":
                shortBreakLength = TimeSpan.FromMinutes(minutes);
                break;
            case "3":
                longBreakLength = TimeSpan.FromMinutes(minutes);
                break;
        }

        Console.WriteLine("Updated!");
    }
}
