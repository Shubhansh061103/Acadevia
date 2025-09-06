'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FiBook, FiClock, FiUsers, FiLock, FiPlay, FiStar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Course {
    id: string;
    title: string;
    description: string;
    grade: string;
    subject: string;
    instructor: string;
    thumbnail: string;
    price: number;
    discountedPrice?: number;
    duration: string;
    lessonsCount: number;
    enrolledStudents: number;
    rating: number;
    isEnrolled: boolean;
    isPremium: boolean;
    progress?: number;
    nextLesson?: {
        id: string;
        title: string;
    };
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [courses, selectedGrade, selectedSubject]);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/student/courses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = [...courses];

        if (selectedGrade !== 'all') {
            filtered = filtered.filter(course => course.grade === selectedGrade);
        }

        if (selectedSubject !== 'all') {
            filtered = filtered.filter(course => course.subject === selectedSubject);
        }

        setFilteredCourses(filtered);
    };

    const handleEnroll = (course: Course) => {
        if (course.isPremium && !course.isEnrolled) {
            setSelectedCourse(course);
            setShowPaymentDialog(true);
        } else {
            router.push(`/student/courses/${course.id}`);
        }
    };

    const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science'];

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar userType="student" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar userType="student" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
                        <p className="text-gray-600 mt-2">Continue learning or explore new courses</p>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6 p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grade
                                </label>
                                <select
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="all">All Grades</option>
                                    {grades.map(grade => (
                                        <option key={grade} value={grade}>Grade {grade}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="all">All Subjects</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Enrolled Courses */}
                    {filteredCourses.filter(c => c.isEnrolled).length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.filter(c => c.isEnrolled).map((course) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="overflow-hidden cursor-pointer" onClick={() => router.push(`/student/courses/${course.id}`)}>
                                            {/* Course Thumbnail */}
                                            <div className="relative h-48 bg-gradient-to-r from-purple-400 to-blue-500">
                                                <div className="absolute inset-0 bg-black/20"></div>
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <h3 className="text-xl font-bold">{course.title}</h3>
                                                    <p className="text-sm opacity-90">{course.subject} • Grade {course.grade}</p>
                                                </div>
                                                {/* Progress Bar */}
                                                {course.progress !== undefined && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                                                        <div
                                                            className="h-full bg-green-400 transition-all"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FiClock className="w-4 h-4" />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FiBook className="w-4 h-4" />
                                                        <span>{course.lessonsCount} lessons</span>
                                                    </div>
                                                </div>

                                                {course.nextLesson && (
                                                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                                                        <p className="text-xs text-purple-600 mb-1">Next Lesson</p>
                                                        <p className="text-sm font-medium text-purple-800">{course.nextLesson.title}</p>
                                                    </div>
                                                )}

                                                <Button variant="primary" fullWidth>
                                                    Continue Learning
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available Courses */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.filter(c => !c.isEnrolled).map((course) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="overflow-hidden">
                                        {/* Course Thumbnail */}
                                        <div className="relative h-48 bg-gradient-to-r from-purple-400 to-blue-500">
                                            <div className="absolute inset-0 bg-black/20"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h3 className="text-xl font-bold">{course.title}</h3>
                                                <p className="text-sm opacity-90">{course.subject} • Grade {course.grade}</p>
                                            </div>
                                            {course.isPremium && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <FiLock className="w-3 h-3" />
                                                        Premium
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {course.description}
                                            </p>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiUsers className="w-4 h-4" />
                                                    <span>{course.enrolledStudents} students</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-medium">{course.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-sm text-gray-600">
                                                    <FiClock className="w-4 h-4 inline mr-1" />
                                                    {course.duration}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <FiBook className="w-4 h-4 inline mr-1" />
                                                    {course.lessonsCount} lessons
                                                </div>
                                            </div>

                                            {course.isPremium && (
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2">
                                                        {course.discountedPrice ? (
                                                            <>
                                                                <span className="text-xl font-bold text-green-600">
                                                                    ₹{course.discountedPrice}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    ₹{course.price}
                                                                </span>
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                    {Math.round(((course.price - course.discountedPrice) / course.price) * 100)}% OFF
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xl font-bold">₹{course.price}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                variant={course.isPremium ? "primary" : "outline"}
                                                fullWidth
                                                onClick={() => handleEnroll(course)}
                                            >
                                                {course.isPremium ? (
                                                    <>
                                                        <FiLock className="w-4 h-4 mr-2" />
                                                        Enroll Now
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiPlay className="w-4 h-4 mr-2" />
                                                        Start Free
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Dialog */}
                    <Dialog
                        isOpen={showPaymentDialog}
                        onClose={() => setShowPaymentDialog(false)}
                        title="Complete Your Enrollment"
                        description="Choose your payment method to unlock this course"
                    >
                        {selectedCourse && (
                            <div>
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold mb-2">{selectedCourse.title}</h4>
                                    <p className="text-sm text-gray-600">{selectedCourse.subject} • Grade {selectedCourse.grade}</p>
                                    <div className="mt-2 text-2xl font-bold">
                                        ₹{selectedCourse.discountedPrice || selectedCourse.price}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => router.push(`/student/payment?courseId=${selectedCourse.id}`)}
                                    >
                                        Proceed to Payment
                                    </Button>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={() => setShowPaymentDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </main>
            </div>
        </div>
    );
}