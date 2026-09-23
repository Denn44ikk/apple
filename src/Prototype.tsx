import { useMemo, useState } from "react";
import {
  ArrowLeftIcon, ArrowRightIcon, BarChartIcon, CalendarIcon, CheckIcon,
  DotsVerticalIcon, DragHandleDots2Icon, GearIcon, LoopIcon,
  Pencil1Icon, PlusIcon, TrashIcon,
} from "@radix-ui/react-icons";
import { BottomSheet, Carousel, KeyboardInput, MobileScroll, useKeyboard } from "./mobile";

type View = "Список" | "Неделя" | "Месяц" | "Год";
type Tone = "blue" | "sage" | "sand";
type Repeat = "none" | "daily" | "weekly" | "monthly" | "yearly";
type Category = { id: string; name: string; tone: Tone };
type Task = { id: number; title: string; categoryId: string; date: string; completedDates: string[]; note?: string; repeat: Repeat };

const initialCategories: Category[] = [
  { id: "work", name: "Работа", tone: "blue" },
  { id: "study", name: "Учёба", tone: "sage" },
  { id: "home", name: "Дом", tone: "sand" },
];
const initialTasks: Task[] = [
  { id: 1, title: "Подготовить презентацию", categoryId: "work", date: "2026-09-20", completedDates: [], repeat: "none" },
  { id: 2, title: "Разобрать почту", categoryId: "work", date: "2026-09-20", completedDates: [], repeat: "none" },
  { id: 3, title: "Прочитать главу 3", categoryId: "study", date: "2026-09-20", completedDates: ["2026-09-20"], repeat: "none" },
  { id: 4, title: "Позаниматься английским", categoryId: "study", date: "2026-09-20", completedDates: [], note: "30 минут", repeat: "none" },
  { id: 5, title: "Купить продукты", categoryId: "home", date: "2026-09-20", completedDates: [], note: "Молоко, овощи, хлеб", repeat: "none" },
  { id: 6, title: "Проверить документы", categoryId: "work", date: "2026-09-14", completedDates: ["2026-09-14"], repeat: "none" },
  { id: 7, title: "Ответить коллегам", categoryId: "work", date: "2026-09-14", completedDates: ["2026-09-14"], repeat: "none" },
  { id: 8, title: "Повторить конспект", categoryId: "study", date: "2026-09-15", completedDates: ["2026-09-15"], repeat: "none" },
  { id: 9, title: "Сдать отчёт", categoryId: "work", date: "2026-09-16", completedDates: ["2026-09-16"], repeat: "none" },
  { id: 10, title: "Записать идеи", categoryId: "study", date: "2026-09-17", completedDates: ["2026-09-17"], repeat: "none" },
  { id: 11, title: "Спланировать покупки", categoryId: "home", date: "2026-09-18", completedDates: ["2026-09-18"], repeat: "none" },
  { id: 12, title: "Отправить письмо", categoryId: "work", date: "2026-09-18", completedDates: [], repeat: "none" },
];
const views: View[] = ["Список", "Неделя", "Месяц", "Год"];
const repeatOptions: { value: Repeat; label: string }[] = [
  { value: "none", label: "Не повторять" }, { value: "daily", label: "Каждый день" },
  { value: "weekly", label: "Каждую неделю" }, { value: "monthly", label: "Каждый месяц" },
  { value: "yearly", label: "Каждый год" },
];

function dateValue(iso: string) { return new Date(`${iso}T12:00:00`); }
function toIso(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function addDays(iso: string, days: number) { const date = dateValue(iso); date.setDate(date.getDate() + days); return toIso(date); }
function weekDates(iso: string) { const offset = (dateValue(iso).getDay() + 6) % 7; return Array.from({ length: 7 }, (_, index) => addDays(iso, index - offset)); }
function humanDate(iso: string) { return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(dateValue(iso)); }
function weekDay(iso: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(dateValue(iso)); }
function shortDate(iso: string) { return new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric" }).format(dateValue(iso)).replace(".", ""); }
function taskWord(count: number) { const ten = count % 10, hundred = count % 100; return ten === 1 && hundred !== 11 ? "задача" : ten >= 2 && ten <= 4 && (hundred < 12 || hundred > 14) ? "задачи" : "задач"; }
function occursOnDate(task: Task, iso: string) {
  if (iso < task.date) return false;
  if (task.repeat === "none") return iso === task.date;
  const start = dateValue(task.date), date = dateValue(iso);
  if (task.repeat === "daily") return true;
  if (task.repeat === "weekly") return start.getDay() === date.getDay();
  if (task.repeat === "monthly") return start.getDate() === date.getDate();
  return start.getDate() === date.getDate() && start.getMonth() === date.getMonth();
}
function completion(tasks: Task[], iso: string) { return tasks.filter((task) => task.completedDates.includes(iso)).length; }
function percent(done: number, total: number) { return total ? Math.round(done / total * 100) : 0; }

export default function Prototype() {
  const [categories, setCategories] = useState(initialCategories);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedDate, setSelectedDate] = useState("2026-09-20");
  const [view, setView] = useState<View>("Список");
  const [tab, setTab] = useState<"План" | "Настройки">("План");
  const [theme, setTheme] = useState("classic");
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [actionTask, setActionTask] = useState<{ task: Task; date: string } | null>(null);
  const [title, setTitle] = useState("");
  const [taskDate, setTaskDate] = useState(selectedDate);
  const [categoryId, setCategoryId] = useState("work");
  const [repeat, setRepeat] = useState<Repeat>("none");
  const [newCategoryName, setNewCategoryName] = useState("");
  const keyboard = useKeyboard();
  const selectedTasks = useMemo(() => tasks.filter((task) => occursOnDate(task, selectedDate)), [tasks, selectedDate]);

  function toggleTask(id: number, iso: string) {
    setTasks((current) => current.map((task) => task.id === id ? {
      ...task,
      completedDates: task.completedDates.includes(iso) ? task.completedDates.filter((day) => day !== iso) : [...task.completedDates, iso],
    } : task));
  }
  function addTask() {
    if (!title.trim()) return;
    setTasks((current) => [...current, { id: Date.now(), title: title.trim(), categoryId, date: taskDate, completedDates: [], repeat }]);
    setSelectedDate(taskDate); setTitle(""); setRepeat("none"); setView("Список"); keyboard.hide(); setTaskSheetOpen(false);
  }
  function moveCategory(id: string, amount: number) {
    setCategories((current) => {
      const from = current.findIndex((category) => category.id === id), to = from + amount;
      if (from < 0 || to < 0 || to >= current.length) return current;
      const next = [...current]; [next[from], next[to]] = [next[to], next[from]]; return next;
    });
  }
  function addCategory() {
    const name = newCategoryName.trim(); if (!name) return;
    const tones: Tone[] = ["blue", "sage", "sand"];
    setCategories((current) => [...current, { id: `category-${Date.now()}`, name, tone: tones[current.length % tones.length] }]);
    setNewCategoryName(""); keyboard.hide();
  }

  return <><MobileScroll className="planner-scroll"><main className={`planner-screen theme-${theme}`} aria-label="Мой план">
    {tab === "План" ? <>
      <header className="planner-header"><h1>Мой план</h1><div className="date-navigation"><button type="button" aria-label="Предыдущий день" onClick={() => setSelectedDate(addDays(selectedDate, -1))}><ArrowLeftIcon /></button><div><p className="date-title">{humanDate(selectedDate)}</p><p className="weekday">{weekDay(selectedDate)}</p></div><button type="button" aria-label="Следующий день" onClick={() => setSelectedDate(addDays(selectedDate, 1))}><ArrowRightIcon /></button></div></header>
      <section className="categories-section"><div className="section-heading"><h2>Категории</h2><button type="button" className="text-button" onClick={() => setCategorySheetOpen(true)}><Pencil1Icon />Управлять</button></div><Carousel className="category-carousel" contentClassName="category-track" ariaLabel="Категории">{categories.map((category) => { const count = selectedTasks.filter((task) => task.categoryId === category.id && !task.completedDates.includes(selectedDate)).length; return <article className={`category-card tone-${category.tone}`} key={category.id}><DragHandleDots2Icon className="drag-icon" /><h3>{category.name || "Без названия"}</h3><span>{count} {taskWord(count)}</span></article>; })}</Carousel></section>
      <section className="today-section"><div className="section-heading task-heading"><div><h2>{selectedDate === "2026-09-20" ? "Сегодня" : humanDate(selectedDate)}</h2><p>{completion(selectedTasks, selectedDate)} из {selectedTasks.length} выполнено</p></div><button className="task-add-inline" type="button" data-testid="add-task" onClick={() => { setTaskDate(selectedDate); setTaskSheetOpen(true); }}><PlusIcon />Добавить</button></div><div className="view-switcher" role="tablist">{views.map((option) => <button type="button" role="tab" aria-selected={view === option} className={view === option ? "active" : ""} data-testid={`view-${option}`} key={option} onClick={() => setView(option)}>{option}</button>)}</div>
        {view === "Список" ? <GroupedTasks categories={categories} tasks={selectedTasks} date={selectedDate} onToggle={toggleTask} onActions={(task, date) => setActionTask({ task, date })} onAdd={() => setTaskSheetOpen(true)} /> : view === "Неделя" ? <WeekView categories={categories} tasks={tasks} selectedDate={selectedDate} onToggle={toggleTask} onActions={(task, date) => setActionTask({ task, date })} onSelectDate={(iso) => { setSelectedDate(iso); setView("Список"); }} /> : view === "Месяц" ? <MonthView tasks={tasks} selectedDate={selectedDate} onSelectDate={(iso) => { setSelectedDate(iso); setView("Список"); }} /> : <div className="year-view"><BarChartIcon /><h3>Годовой план</h3><p>Откройте месяц, чтобы выбрать нужный день.</p></div>}
      </section>
    </> : <SettingsPage theme={theme} onTheme={setTheme} />}
  </main></MobileScroll>
    <nav className={`bottom-nav two-tabs theme-${theme}`} aria-label="Основная навигация"><button type="button" className={tab === "План" ? "active" : ""} onClick={() => setTab("План")}><CalendarIcon /><span>План</span></button><button type="button" className={tab === "Настройки" ? "active" : ""} onClick={() => setTab("Настройки")}><GearIcon /><span>Настройки</span></button></nav>
    <BottomSheet open={taskSheetOpen} onOpenChange={setTaskSheetOpen} title="Новая задача" description="Выберите дату и категорию для задачи."><div className="task-form"><label className="form-label" htmlFor="task-title">Задача</label><KeyboardInput id="task-title" data-testid="task-title" value={title} placeholder="Например, оплатить курс" onChange={(event) => setTitle(event.target.value)} /><label className="form-label" htmlFor="task-date">Дата начала</label><KeyboardInput id="task-date" type="date" value={taskDate} onChange={(event) => setTaskDate(event.target.value)} /><label className="form-label" htmlFor="task-category">Категория</label><select id="task-category" data-testid="task-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select><label className="form-label" htmlFor="task-repeat">Повторять</label><select id="task-repeat" data-testid="task-repeat" value={repeat} onChange={(event) => setRepeat(event.target.value as Repeat)}>{repeatOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select><button className="sheet-submit" data-testid="save-task" type="button" onClick={addTask}><PlusIcon />Добавить в план</button></div></BottomSheet>
    <BottomSheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen} title="Категории" description="Измените название или порядок категорий."><div className="category-manager">{categories.map((category, index) => <div className="category-manager-row" key={category.id}><KeyboardInput value={category.name} aria-label={`Название категории ${category.name}`} onChange={(event) => setCategories((current) => current.map((item) => item.id === category.id ? { ...item, name: event.target.value } : item))} /><div className="category-manager-actions"><button type="button" aria-label="Поднять категорию" disabled={index === 0} onClick={() => moveCategory(category.id, -1)}>↑</button><button type="button" aria-label="Опустить категорию" disabled={index === categories.length - 1} onClick={() => moveCategory(category.id, 1)}>↓</button><button type="button" aria-label="Удалить категорию" disabled={categories.length === 1 || tasks.some((task) => task.categoryId === category.id)} onClick={() => setCategories((current) => current.filter((item) => item.id !== category.id))}><TrashIcon /></button></div></div>)}<div className="new-category-form"><KeyboardInput value={newCategoryName} placeholder="Название новой категории" aria-label="Название новой категории" onChange={(event) => setNewCategoryName(event.target.value)} /><button type="button" onClick={addCategory}><PlusIcon />Добавить</button></div></div></BottomSheet>
    <BottomSheet open={Boolean(actionTask)} onOpenChange={(open) => !open && setActionTask(null)} title={actionTask?.task.title ?? "Задача"}><div className="task-actions"><button type="button" onClick={() => { if (actionTask) toggleTask(actionTask.task.id, actionTask.date); setActionTask(null); }}><CheckIcon />{actionTask?.task.completedDates.includes(actionTask.date) ? "Вернуть в план" : "Отметить выполненной"}</button><button className="danger-action" type="button" onClick={() => { if (actionTask) setTasks((current) => current.filter((task) => task.id !== actionTask.task.id)); setActionTask(null); }}><TrashIcon />Удалить задачу</button></div></BottomSheet>
  </>;
}

function TaskRow({ task, date, onToggle, onActions, compact = false }: { task: Task; date: string; onToggle: (id: number, date: string) => void; onActions: (task: Task, date: string) => void; compact?: boolean }) {
  const done = task.completedDates.includes(date);
  return <article className={`task-row ${done ? "is-done" : ""} ${compact ? "compact" : ""}`}><button className="check-button" type="button" aria-label={`${done ? "Вернуть" : "Выполнить"} задачу ${task.title}`} onClick={() => onToggle(task.id, date)}>{done ? <CheckIcon /> : null}</button><div className="task-copy"><h3>{task.title}</h3>{!compact && task.note ? <p>{task.note}</p> : null}{!compact && task.repeat !== "none" ? <span className="repeat-label"><LoopIcon />Повторяется</span> : null}</div><button className="more-button" type="button" aria-label={`Действия: ${task.title}`} onClick={() => onActions(task, date)}><DotsVerticalIcon /></button></article>;
}
function GroupedTasks({ categories, tasks, date, onToggle, onActions, onAdd }: { categories: Category[]; tasks: Task[]; date: string; onToggle: (id: number, date: string) => void; onActions: (task: Task, date: string) => void; onAdd: () => void }) {
  if (!tasks.length) return <div className="empty-day"><CalendarIcon /><p>На этот день задач нет.</p><button type="button" onClick={onAdd}>Добавить первую</button></div>;
  return <div className="grouped-task-list" data-testid="grouped-task-list">{categories.map((category) => { const group = tasks.filter((task) => task.categoryId === category.id); if (!group.length) return null; return <section className="task-group" key={category.id}><div className="task-group-heading"><span className={`group-dot tone-${category.tone}`} /><h3>{category.name}</h3><span>{completion(group, date)}/{group.length}</span></div><div className="task-list">{group.map((task) => <TaskRow key={task.id} task={task} date={date} onToggle={onToggle} onActions={onActions} />)}</div></section>; })}</div>;
}
function WeekView({ categories, tasks, selectedDate, onToggle, onActions, onSelectDate }: { categories: Category[]; tasks: Task[]; selectedDate: string; onToggle: (id: number, date: string) => void; onActions: (task: Task, date: string) => void; onSelectDate: (date: string) => void }) {
  const dates = weekDates(selectedDate);
  const week = dates.flatMap((date) => tasks.filter((task) => occursOnDate(task, date)).map((task) => ({ date, task })));
  const done = week.filter(({ date, task }) => task.completedDates.includes(date)).length;
  return <div className="week-view" data-testid="week-view"><div className="week-summary"><div><strong>Неделя</strong><span>{humanDate(dates[0])} — {humanDate(dates[6])}</span></div><b>{percent(done, week.length)}%</b><p>{done} из {week.length} выполнено</p></div>{dates.map((date) => { const dayTasks = tasks.filter((task) => occursOnDate(task, date)); const dayDone = completion(dayTasks, date); return <section className={`week-card ${date === selectedDate ? "current" : ""}`} key={date}><div className="week-card-header"><button type="button" className="week-card-title" onClick={() => onSelectDate(date)}><strong>{shortDate(date)}</strong><span>{dayTasks.length} {taskWord(dayTasks.length)}</span></button><div className="day-percent" aria-label={`Выполнено ${percent(dayDone, dayTasks.length)} процентов`}>{dayTasks.length ? `${percent(dayDone, dayTasks.length)}%` : "—"}</div></div>{dayTasks.length ? <div className="week-card-groups">{categories.map((category) => { const group = dayTasks.filter((task) => task.categoryId === category.id); return group.length ? <div className="week-category" key={category.id}><h4><span className={`group-dot tone-${category.tone}`} />{category.name}</h4>{group.map((task) => <TaskRow key={task.id} compact task={task} date={date} onToggle={onToggle} onActions={onActions} />)}</div> : null; })}</div> : <p className="week-empty">Задач нет</p>}</section>; })}</div>;
}
function MonthView({ tasks, selectedDate, onSelectDate }: { tasks: Task[]; selectedDate: string; onSelectDate: (date: string) => void }) {
  const start = dateValue(selectedDate), count = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  return <div className="month-grid">{Array.from({ length: count }, (_, index) => { const date = toIso(new Date(start.getFullYear(), start.getMonth(), index + 1)); const dayTasks = tasks.filter((task) => occursOnDate(task, date)); return <button className={date === selectedDate ? "month-day current" : "month-day"} type="button" key={date} onClick={() => onSelectDate(date)}><strong>{index + 1}</strong>{dayTasks.length ? <span>{completion(dayTasks, date)}/{dayTasks.length}</span> : null}</button>; })}</div>;
}
function SettingsPage({ theme, onTheme }: { theme: string; onTheme: (theme: string) => void }) {
  const themes = [{ id: "classic", name: "Спокойная", color: "#63886d" }, { id: "sky", name: "Небесная", color: "#5d7ea6" }, { id: "lilac", name: "Лавандовая", color: "#806ba3" }];
  return <><header className="planner-header"><h1>Настройки</h1><p className="screen-subtitle">Внешний вид приложения</p></header><section className="settings-card"><h2>Цвет интерфейса</h2><div className="theme-swatches">{themes.map((item) => <button type="button" aria-label={item.name} className={theme === item.id ? "selected" : ""} key={item.id} onClick={() => onTheme(item.id)}><i style={{ background: item.color }} />{theme === item.id ? <CheckIcon /> : null}</button>)}</div></section></>;
}
