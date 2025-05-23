import {
  CheckCircle,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import logo from "../../public/nexa-icon.png";
import { Link } from "react-router-dom";
import desktopView from "../assets/desktop-view.png";
import manImage from "../assets/male1.jpeg";
import ToggleDarkMode from "../components/ToggleDarkMode";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    {
      name: "Features",
      url: "#features",
    },
    {
      name: "Pricing",
      url: "#pricing",
    },
    {
      name: "Testimonials",
      url: "#testimonials",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white fixed w-screen z-50 dark:bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img className="rounded-sm mr-2" src={logo} alt="Nexa Logo" />

              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Nexa
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-900"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-900"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-900"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-900"
              >
                FAQ
              </a>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to={"/login"}
                className="text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                Sign Up Free
              </Link>
              <ToggleDarkMode />
            </div>
            <div
              className="md:hidden flex items-center cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X className="dark:text-white" />
              ) : (
                <Menu className="dark:text-white" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-black pt-16 pb-20">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, delay: 0 },
              }}
              exit={{
                opacity: 0,
                x: 60,
                transition: { duration: 1, delay: 0 },
              }}
              className=" h-screen z-50 w-[80%] fixed right-0 dark:bg-black  dark:text-white bg-gray-50 border-r dark:border-white/20 border-gray-300 "
            >
              <div className="flex flex-col  mb-7 pt-5">
                {navLinks.map((link) => (
                  <a
                    href={link.url}
                    className="w-full flex  items-center gap-4 text-base  py-3 px-6 mb-3 cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}

                <Link
                  className="w-full flex items-center gap-4 text-base py-3 px-6
                mb-3 cursor-pointer"
                  to={"/register"}
                >
                  Sign Up Free
                </Link>

                <Link
                  className="w-full flex items-center gap-4 text-base py-3 px-6
                mb-3 cursor-pointer"
                  to={"/login"}
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="max-w-7xl md:mt-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 xl:col-span-5">
              <motion.h1
                initial={{ opacity: 0, x: -40 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1, delay: 0 },
                }}
                className="mt-4 text-4xl tracking-tight font-extrabold dark:text-white text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6"
              >
                Simplify Your Workflow with Nexa
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: 40 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1.2, delay: 0 },
                }}
                className="mt-3 text-base dark:text-gray-200 text-gray-500 sm:mt-5 sm:text-xl"
              >
                Streamline project tracking, team collaboration, and task
                management in one intuitive platform. Boost productivity and
                keep your team organized with Nexa.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 1.5, delay: 0 },
                }}
                className="mt-8 sm:mt-12"
              >
                <form className="sm:max-w-xl sm:mx-auto lg:mx-0">
                  <div className="sm:flex">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="block w-full px-4 py-3 outline-0 text-black dark:text-white rounded-md border border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <button
                        type="submit"
                        className="block w-full py-3 px-6 rounded-md shadow bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Start Free Trial
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm dark:text-gray-300 text-gray-500">
                    14-day free trial. No credit card required.
                  </p>
                </form>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 1, delay: 0 },
              }}
              className="mt-12 relative sm:max-w-2xl lg:mt-0 lg:col-span-6 xl:col-span-7"
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-full">
                <img
                  className="w-full "
                  src={desktopView}
                  alt="Screenshot of Nexa dashboard"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">
              Everything you need to manage your team's tasks
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl dark:text-gray-200 text-gray-500">
              Nexa provides essential tools for efficient task management and
              team collaboration.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.2, delay: 0 },
                }}
                className="bg-white dark:bg-black overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center text-emerald-600 mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="text-lg font-medium dark:text-white text-gray-900">
                    Task Management
                  </h3>
                  <p className="mt-2 text-base dark:text-gray-200 text-gray-500">
                    Create, assign, and track tasks with ease. Set priorities,
                    deadlines, and monitor progress.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.4, delay: 0 },
                }}
                className="bg-white dark:bg-black overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="text-lg font-medium dark:text-white text-gray-900">
                    Team Collaboration
                  </h3>
                  <p className="mt-2 text-base dark:text-gray-200 text-gray-500">
                    Work together seamlessly with comments, file sharing, and
                    real-time updates.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.6, delay: 0 },
                }}
                className="bg-white dark:bg-black  overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center text-purple-600 mb-4">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-lg font-medium dark:text-white text-gray-900">
                    Project Timeline
                  </h3>
                  <p className="mt-2 text-base dark:text-gray-200  text-gray-500">
                    Visualize project schedules, milestones, and deadlines with
                    intuitive timeline views.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, delay: 0 },
                }}
                className="bg-white dark:bg-black overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center text-amber-600 mb-4">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-lg font-medium dark:text-white text-gray-900">
                    Time Tracking
                  </h3>
                  <p className="mt-2 text-base dark:text-gray-200 text-gray-500">
                    Monitor time spent on tasks and projects to improve
                    productivity and planning.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">
              How Nexa Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl dark:text-gray-200 text-gray-500">
              Get started in minutes with our simple onboarding process.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.4, delay: 0 },
                }}
                className="text-center"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-900 text-2xl font-bold">
                  1
                </div>
                <h3 className="mt-6 text-lg font-medium dark:text-white text-gray-900">
                  Create Your Workspace
                </h3>
                <p className="mt-2 text-base dark:text-gray-200  text-gray-500">
                  Sign up and create your team workspace in just a few clicks.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0 },
                }}
                className="text-center"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-900 text-2xl font-bold">
                  2
                </div>
                <h3 className="mt-6 text-lg font-medium dark:text-white text-gray-900">
                  Invite Team Members
                </h3>
                <p className="mt-2 text-base dark:text-gray-200 text-gray-500">
                  Add your colleagues and assign roles to start collaborating.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.8, delay: 0 },
                }}
                className="text-center"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-900 text-2xl font-bold">
                  3
                </div>
                <h3 className="mt-6 text-lg font-medium dark:text-white text-gray-900">
                  Start Managing Tasks
                </h3>
                <p className="mt-2 text-base dark:text-gray-200 text-gray-500">
                  Create projects, assign tasks, and track progress efficiently.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section id="testimonials" className="py-16 bg-gray-50 dark:bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">
              Trusted by Teams Worldwide
            </h2>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-black shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-900 dark:bg-gray-200">
                    <img
                      src={manImage}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">Robert Jinwoo</h4>
                    <p className="dark:text-gray-200 text-gray-600">
                      Project Manager, TechCorp
                    </p>
                  </div>
                </div>
                <blockquote className="mt-6 dark:text-gray-200 text-gray-700">
                  <p className="text-lg italic">
                    "Nexa has transformed how our team manages projects. The
                    intuitive interface and powerful features have increased our
                    productivity by 30%. I can't imagine going back to our old
                    workflow."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl dark:text-gray-200k dark:text-gray-200 text-gray-500">
              Choose the plan that's right for your team.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: "2deg",
                transition: { duration: 0.1, delay: 0 },
              }}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium dark:text-white text-gray-900">
                  Starter
                </h3>
                <p className="mt-4">
                  <span className="text-3xl text-gray-500 dark:text-white  font-bold">
                    $9
                  </span>
                  <span className="text-gray-500 dark:text-white ">
                    /month per user
                  </span>
                </p>
                <p className="mt-4 text-gray-500 dark:text-white">
                  Perfect for small teams getting started.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-white">
                      Unlimited tasks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-white">
                      Basic reporting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-white">
                      5 team members
                    </span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a
                    href="#"
                    className="block w-full bg-emerald-600 text-white text-center px-4 py-2 rounded-md hover:bg-emerald-700"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: "-2deg",
                transition: { duration: 0.1, delay: 0 },
              }}
              className="bg-white dark:bg-black rounded-lg shadow-lg overflow-hidden border-2 border-emerald-500 relative"
            >
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-sm font-semibold">
                POPULAR
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium dark:text-white text-gray-900">
                  Professional
                </h3>
                <p className="mt-4">
                  <span className="text-3xl dark:text-gray-200 text-gray-500 font-bold">
                    $19
                  </span>
                  <span className="text-gray-500 dark:text-gray-200 ">
                    /month per user
                  </span>
                </p>
                <p className="mt-4 text-gray-500 dark:text-gray-200">
                  Great for growing teams needing more features.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Everything in Starter
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Advanced reporting
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Unlimited team members
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Time tracking
                    </span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a
                    href="#"
                    className="block w-full bg-emerald-600 text-white text-center px-4 py-2 rounded-md hover:bg-emerald-700"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: "2deg",
                transition: { duration: 0.1, delay: 0 },
              }}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Enterprise
                </h3>
                <p className="mt-4">
                  <span className="text-3xl text-gray-500 dark:text-gray-200 font-bold">
                    $39
                  </span>
                  <span className="text-gray-500 dark:text-gray-200">
                    /month per user
                  </span>
                </p>
                <p className="mt-4 text-gray-500 dark:text-gray-200">
                  For organizations needing advanced features.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Everything in Professional
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Custom integrations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Dedicated support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 text-green-500"
                    />
                    <span className="ml-3 text-gray-500 dark:text-gray-200">
                      Advanced security
                    </span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a
                    href="#"
                    className="block w-full bg-emerald-600 text-white text-center px-4 py-2 rounded-md hover:bg-emerald-700"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to streamline your workflow?</span>
            <span className="block text-emerald-200">
              Start your free trial today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50"
              >
                Get started
                <ArrowRight size={20} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    API Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2025 Nexa, Inc. All rights reserved.
            </p>
            <p className="pb-2  text-center mt-5 text-gray-300 font-bold">
              &copy;2025 - {new Date().getFullYear()} Made with 💓 by GLtech
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
