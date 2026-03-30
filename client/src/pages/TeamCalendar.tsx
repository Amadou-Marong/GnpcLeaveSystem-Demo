import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leaveTypes } from "@/data/dummyData"
import { Layout } from "@/layout/Layout"
import { useAuthStore } from "@/store/auth.store"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { useState } from "react"

const TeamCalendar = () => {
    const currentUser = useAuthStore((state) => state.currentUser)
    const [currentDate, setCurrentDate] = useState(new Date)
    const [typeFilter, setTypeFilter] = useState("all")

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDate()
    }

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            setCurrentDate(date)
        }
    }

    const isToday = (day: number) => {
        return  today.getDate() === day &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear()
    }

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i)
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Team Calendar</h1>
                        <p className="text-muted-foreground">{currentUser?.department} Department</p>
                    </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={prevMonth}>
                                <ChevronLeft className="w-5 h-5"/>
                            </Button>
                            <h2 className="text-lg font-semibold text-foreground min-w-45 text-center">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={nextMonth}>
                                <ChevronRight className="w-5 h-5"/>
                            </Button>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                className="w-45 justify-start text-left font-normal"
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(currentDate, "PPP")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={currentDate}
                                onSelect={handleCalendarSelect}
                                autoFocus
                                className="p-3 pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-40">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {leaveTypes.map((lt) => (
                                <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {dayNames.map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, index) => (
                            <div key={index}
                                className={`
                                min-h-25 p-2 border border-border rounded-lg
                                ${day === null ? 'bg-muted/30' : 'bg-card hover:bg-muted/50'}
                                ${isToday(day!) ? 'bg-primary/10 border-primary' : ''}
                                `}>
                                {day && (
                                <span className={`text-sm ${isToday(day) ? 'text-primary font-bold' : 'text-foreground'}`}>
                                    {day}
                                </span>
                                )}
                            </div>
                        ))}
                    </div>
                    

                    {/* Legend */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <h3 className="font-medium text-foreground mb-3">Legend</h3>
                        <div className="flex flex-wrap gap-4">
                        {leaveTypes.map((lt) => (
                            <div key={lt.id} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lt.color }} />
                            <span className="text-sm text-muted-foreground">{lt.name}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default TeamCalendar