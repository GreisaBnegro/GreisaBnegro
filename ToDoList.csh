using System;
using System.Collections.Generic;
using System.IO;

class TaskItem
{
    public string Description { get; set; }
    public bool IsCompleted { get; set; }

    public override string ToString()
    {
        return $"{(IsCompleted ? "[X]" : "[ ]")} {Description}";
    }
}

class Program
{
    static string filePath = "tasks.txt";
    static List<TaskItem> tasks = new List<TaskItem>();

    static void Main()
    {
        LoadTasks();

        while (true)
        {
            Console.Clear();
            Console.WriteLine("⋆ ˚｡⋆୨🎀୧⋆ ˚｡ ⋆ To-Do List ⋆ ˚｡⋆୨🎀୧⋆ ˚｡⋆ ");
            DisplayTasks();

            Console.WriteLine("\nOptions: °❀⋆.ೃ࿔*:･");
            Console.WriteLine("1. Add Task");
            Console.WriteLine("2. Complete Task");
            Console.WriteLine("3. Delete Task");
            Console.WriteLine("4. Exit");

            Console.Write("\n *✩₊˚༺☆༻*✩₊˚ Choose an option: ");
            string choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    AddTask();
                    break;

                case "2":
                    CompleteTask();
                    break;

                case "3":
                    DeleteTask();
                    break;

                case "4":
                    SaveTasks();
                    return;

                default:
                    Console.WriteLine("Invalid option! Press Enter to continue.");
                    Console.ReadLine();
                    break;
            }
        }
    }

    static void DisplayTasks()
    {
        if (tasks.Count == 0)
        {
            Console.WriteLine("No tasks found.");
            return;
        }

        for (int i = 0; i < tasks.Count; i++)
        {
            Console.WriteLine($"{i + 1}. {tasks[i]}");
        }
    }

    static void AddTask()
    {
        Console.Write("Enter task description: ");
        string desc = Console.ReadLine();

        if (!string.IsNullOrWhiteSpace(desc))
        {
            tasks.Add(new TaskItem
            {
                Description = desc,
                IsCompleted = false
            });
        }
    }

    static void CompleteTask()
    {
        Console.Write("Enter task number: ");
        if (int.TryParse(Console.ReadLine(), out int num) &&
            num >= 1 && num <= tasks.Count)
        {
            tasks[num - 1].IsCompleted = true;
        }
        else
        {
            Console.WriteLine("Invalid task number. Press Enter to continue.");
            Console.ReadLine();
        }
    }

    static void DeleteTask()
    {
        Console.Write("Enter task number: ");
        if (int.TryParse(Console.ReadLine(), out int num) &&
            num >= 1 && num <= tasks.Count)
        {
            tasks.RemoveAt(num - 1);
        }
        else
        {
            Console.WriteLine("Invalid task number. Press Enter to continue.");
            Console.ReadLine();
        }
    }

    static void SaveTasks()
    {
        using (StreamWriter writer = new StreamWriter(filePath))
        {
            foreach (var task in tasks)
            {
                writer.WriteLine($"{task.IsCompleted}|{task.Description}");
            }
        }
    }

    static void LoadTasks()
    {
        if (!File.Exists(filePath)) return;

        string[] lines = File.ReadAllLines(filePath);

        foreach (var line in lines)
        {
            string[] parts = line.Split('|');
            if (parts.Length == 2)
            {
                tasks.Add(new TaskItem
                {
                    IsCompleted = bool.Parse(parts[0]),
                    Description = parts[1]
                });
            }
        }
    }
}

