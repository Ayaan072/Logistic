import { Truck, ArrowRight, Package, MapPin, UserCheck, BarChart3, Bell, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">LogiFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#tracking" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Order Tracking</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
              Login
            </button>
            <button onClick={onGetStarted} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideUp">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-blue-700">Single-Order Operator System</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Simplify Every Delivery. <span className="text-blue-600">One Order</span> at a Time.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              LogiFlow helps logistics operators manage deliveries efficiently with real-time order tracking, operator availability, and a streamlined delivery workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onGetStarted} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onLogin} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Login
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-400">Deliveries</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">99.2%</p>
                <p className="text-sm text-gray-400">Success Rate</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-400">Tracking</p>
              </div>
            </div>
          </div>

          <div className="relative animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 font-medium">ORDER #ORD1025</p>
                  <p className="text-lg font-bold text-gray-900">Mumbai → Pune</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  In Transit
                </span>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { label: 'Order Created', done: true },
                  { label: 'Assigned', done: true },
                  { label: 'Accepted', done: true },
                  { label: 'Picked Up', done: true },
                  { label: 'In Transit', done: true, current: true },
                  { label: 'Delivered', done: false },
                  { label: 'Completed', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'} ${step.current ? 'ring-4 ring-orange-100' : ''}`}>
                      {step.done ? '✓' : '○'}
                    </div>
                    <span className={`text-sm ${step.done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">A</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ayaan Verma</p>
                    <p className="text-xs text-gray-400">Operator</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Busy
                </span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-float">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-400">Today</p>
                  <p className="text-sm font-bold text-gray-900">12 Deliveries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">A streamlined workflow from order creation to delivery completion, one order at a time.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Package, title: 'Receive Order', desc: 'Admin creates and assigns an order to an available operator.' },
              { icon: MapPin, title: 'Pick Up', desc: 'Operator accepts and picks up the package from the pickup location.' },
              { icon: Truck, title: 'Transport', desc: 'Package is transported to the delivery destination with live tracking.' },
              { icon: UserCheck, title: 'Deliver', desc: 'Operator delivers the package and marks the order as completed.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-xs font-bold text-blue-600 mb-1">STEP {i + 1}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Powerful Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to manage logistics operations efficiently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Single-Order Workflow', desc: 'Each operator handles one active order at a time, ensuring focused and quality deliveries.' },
              { icon: BarChart3, title: 'Real-Time Dashboard', desc: 'Track all orders, operator availability, and delivery statistics in one central dashboard.' },
              { icon: Bell, title: 'Instant Notifications', desc: 'Get notified when orders are assigned, accepted, picked up, and delivered in real time.' },
              { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Secure admin and operator roles with protected routes and permission-based actions.' },
              { icon: MapPin, title: 'Order Tracking', desc: 'Beautiful progress tracker showing the complete lifecycle of every order from start to finish.' },
              { icon: UserCheck, title: 'Operator Management', desc: 'Manage operators, track their availability status, and assign orders efficiently.' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section id="tracking" className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Complete Order Lifecycle Tracking</h2>
            <p className="text-gray-300 mb-8">From creation to completion, every status change is tracked and timestamped. Never lose visibility on a delivery again.</p>
            <div className="space-y-3">
              {['New orders appear instantly in the dashboard', 'Operators get notified on assignment', 'Status updates with timestamps at every step', 'Complete audit trail for every order'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="space-y-4">
              {[
                { status: 'Order Created', time: '10:30 AM', done: true },
                { status: 'Assigned to Operator', time: '10:45 AM', done: true },
                { status: 'Accepted by Operator', time: '11:00 AM', done: true },
                { status: 'Package Picked Up', time: '11:30 AM', done: true },
                { status: 'In Transit', time: '12:00 PM', done: true, current: true },
                { status: 'Delivered', time: 'Pending', done: false },
                { status: 'Completed', time: 'Pending', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-500'} ${step.current ? 'ring-4 ring-green-500/20' : ''}`}>
                    {step.done ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.status}</p>
                  </div>
                  <p className={`text-xs ${step.done ? 'text-gray-300' : 'text-gray-600'}`}>{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-20 px-4 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Streamline Your Deliveries?</h2>
          <p className="text-gray-500 mb-8">Start using LogiFlow today and experience a cleaner, more focused approach to logistics management.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onGetStarted} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onLogin} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">LogiFlow</span>
          </div>
          <p className="text-sm text-gray-400">Single Order Logistics Operator Platform</p>
        </div>
      </footer>
    </div>
  );
}
