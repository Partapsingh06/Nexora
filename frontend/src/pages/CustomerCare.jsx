import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Package,
  RotateCcw,
  CreditCard,
  UserCheck,
  ShieldAlert,
  MessageSquare,
  PhoneCall,
  Mail,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Send,
  AlertCircle,
  Headphones,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PROBLEM_CATEGORIES = [
  {
    id: 'Orders & Delivery',
    icon: Package,
    title: 'Orders & Delivery',
    desc: 'Track packages, delivery delays, missing items, or courier updates',
    badge: 'Popular',
    issues: [
      {
        type: 'Track my package',
        solution: 'You can check real-time courier tracking in your Orders section.',
        actionLink: '/orders',
        actionText: 'Go to My Orders',
      },
      {
        type: 'Delivery delayed beyond expected date',
        solution: 'If your delivery is delayed due to high volume or weather conditions, express rerouting is automatically prioritized. You can also raise an instant ticket below.',
      },
      {
        type: 'Wrong or missing item delivered',
        solution: 'Please take photos of the outer box and invoice, then submit a replacement or return request from the Orders page within 7 days.',
        actionLink: '/orders',
        actionText: 'Report on Order',
      },
    ],
  },
  {
    id: 'Returns & Refunds',
    icon: RotateCcw,
    title: 'Returns & Refunds',
    desc: '7-day replacement, doorstep pickup status, and refund timelines',
    badge: 'Instant Help',
    issues: [
      {
        type: 'How to initiate return or replacement?',
        solution: 'Go to "My Orders", find the delivered item, and click "Return / Replace". Choose your reason and select pickup slot.',
        actionLink: '/orders',
        actionText: 'View Eligible Orders',
      },
      {
        type: 'When will I get my refund?',
        solution: 'UPI/Card refunds reflect in 2-4 business days after quality check at our hub. COD refunds are sent instantly to your Nexora Wallet or Bank Account.',
      },
      {
        type: 'Pickup agent did not arrive',
        solution: 'Doorstep pickups are scheduled between 9 AM - 7 PM. If missed, our courier partner will re-attempt automatically next morning.',
      },
    ],
  },
  {
    id: 'Payments & Billing',
    icon: CreditCard,
    title: 'Payments & Billing',
    desc: 'Failed transactions, double charges, invoices, and payment modes',
    issues: [
      {
        type: 'Amount deducted but order not placed',
        solution: 'This happens during brief bank gateway timeouts. Your bank automatically releases the funds back to your original source within 24-48 hours.',
      },
      {
        type: 'How to download GST / Tax Invoice?',
        solution: 'Tax invoices can be downloaded directly as PDF from your order details page after dispatch.',
        actionLink: '/orders',
        actionText: 'Download Invoice',
      },
      {
        type: 'Accepted payment methods',
        solution: 'We accept UPI (GPay, PhonePe, Paytm), Visa/Mastercard/RuPay Credit/Debit Cards, Net Banking, and Cash on Delivery.',
      },
    ],
  },
  {
    id: 'Account & Security',
    icon: UserCheck,
    title: 'Account & Security',
    desc: 'Login troubleshooting, profile updates, address changes, security',
    issues: [
      {
        type: 'How to update delivery address or mobile number?',
        solution: 'You can update your default address, name, and phone from your Profile page anytime.',
        actionLink: '/profile',
        actionText: 'Manage Profile',
      },
      {
        type: 'Forgot password or unable to log in',
        solution: 'Use the "Forgot Password" link on the Login page to securely reset your credentials.',
        actionLink: '/login',
        actionText: 'Go to Login',
      },
      {
        type: 'Is my data and payment safe?',
        solution: 'Nexora is secured with 256-Bit SSL encryption and PCI-DSS Level 1 compliance. We never store confidential card PINs or CVVs.',
      },
    ],
  },
  {
    id: 'Product & Warranty',
    icon: ShieldAlert,
    title: 'Product & Warranty',
    desc: 'Authenticity guarantee, brand warranty claims, technical specifications',
    issues: [
      {
        type: 'Are all products authentic?',
        solution: '100% Genuine. Every product on Nexora is sourced directly from brand-authorized distributors and verified with a genuine hologram seal.',
      },
      {
        type: 'How to claim brand warranty?',
        solution: 'Use your Nexora invoice as official proof of purchase at any brand authorized service center nationwide.',
      },
    ],
  },
  {
    id: 'Other Inquiries',
    icon: HelpCircle,
    title: 'General & Others',
    desc: 'Bulk orders, gift cards, promotions, and general assistance',
    issues: [
      {
        type: 'Applying discount coupons or promotional codes',
        solution: 'Enter valid promo codes during Checkout under the "Coupons & Offers" section before proceeding to payment.',
      },
    ],
  },
];

const FAQS_DATA = [
  {
    q: 'How can I contact Nexora 24x7 Customer Support?',
    a: 'You can reach us anytime by calling our toll-free helpline at 1800-208-9898 / 080-4547-0000, sending an email to support@nexora.com, or submitting a support ticket using the interactive form on this page. Our average ticket response time is under 15 minutes.',
  },
  {
    q: 'What is the return window for products on Nexora?',
    a: 'Most items come with a 7-day hassle-free return and replacement policy from the date of delivery. Products must be in original condition with tags and packaging intact.',
  },
  {
    q: 'Can I cancel an order after it has been placed?',
    a: 'Yes, you can cancel your order directly from "My Orders" as long as it has not been marked as Dispatched. If dispatched, you can simply reject delivery at your doorstep for an instant full refund.',
  },
  {
    q: 'Are there any shipping charges on Nexora orders?',
    a: 'Nexora offers FREE express delivery on all orders above ₹499. For orders below ₹499, a nominal shipping charge of ₹40 applies.',
  },
  {
    q: 'How do I check the status of my raised support ticket?',
    a: 'Logged-in users can view all past and active support tickets along with status updates (Open, In Progress, Resolved) directly under the "My Support Tickets" tab on this page.',
  },
];

const CustomerCare = () => {
  const { user, isAuthenticated } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState(PROBLEM_CATEGORIES[0]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Form State
  const [ticketForm, setTicketForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    orderId: '',
    category: 'Orders & Delivery',
    issueType: 'Delayed Delivery',
    priority: 'medium',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(null);
  const [ticketError, setTicketError] = useState('');

  // My Tickets State
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [activeTab, setActiveTab] = useState('help'); // 'help' | 'ticket' | 'my-tickets'

  useEffect(() => {
    if (user) {
      setTicketForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'my-tickets') {
      fetchMyTickets();
    }
  }, [isAuthenticated, activeTab]);

  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get('/support/my-tickets');
      if (res.data.success) {
        setMyTickets(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load tickets', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedIssue(null);
    setTicketForm((prev) => ({
      ...prev,
      category: cat.id,
      issueType: cat.issues[0]?.type || 'General Assistance',
    }));
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setTicketForm((prev) => ({
      ...prev,
      category: selectedCategory.id,
      issueType: issue.type,
    }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketError('');
    setTicketSuccess(null);

    if (!ticketForm.name || !ticketForm.email || !ticketForm.message) {
      setTicketError('Please fill in your name, email, and message description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/support/ticket', ticketForm);
      if (res.data.success) {
        setTicketSuccess(res.data.data);
        setTicketForm({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          orderId: '',
          category: selectedCategory.id,
          issueType: 'General Assistance',
          priority: 'medium',
          message: '',
        });
      }
    } catch (err) {
      setTicketError(
        err.response?.data?.message || 'Failed to submit support ticket. Please try again or call our helpline.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = FAQS_DATA.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-16 font-sans text-gray-800">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-nexora-blue to-blue-700 text-white py-12 px-4 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-8">
          <Headphones className="w-96 h-96 text-white" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-800/60 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-nexora-yellow mb-3 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" /> 24x7 Dedicated Customer Assistance
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Nexora Help & Support Center
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl">
                Have a question or facing an issue with your order, payment, or account? We are here 24 hours a day, 7 days a week.
              </p>
            </div>

            {/* Quick Contact Badge Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-xs sm:text-sm text-white flex flex-col gap-2 min-w-[240px] shadow-lg">
              <div className="flex items-center gap-2 font-bold text-nexora-yellow">
                <PhoneCall className="w-4 h-4 animate-bounce" /> 24x7 Toll-Free Helpline
              </div>
              <div className="text-lg font-black tracking-wide">1800-208-9898</div>
              <div className="text-[11px] text-blue-200 border-t border-white/10 pt-1.5 flex items-center justify-between">
                <span>Avg. Response: &lt; 2 mins</span>
                <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Quick Help Search Bar */}
          <div className="mt-8 max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your issue (e.g. tracking, return policy, refund status, payment failed)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-lg text-gray-900 bg-white placeholder-gray-400 text-sm shadow-lg focus:outline-hidden focus:ring-2 focus:ring-nexora-yellow"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('help')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'help'
                ? 'border-nexora-blue text-nexora-blue'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Issue Solver & FAQs
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`py-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ticket'
                ? 'border-nexora-blue text-nexora-blue'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Send className="w-4 h-4" /> Raise Support Ticket
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`py-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'my-tickets'
                  ? 'border-nexora-blue text-nexora-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" /> My Support Tickets
              {myTickets.length > 0 && (
                <span className="bg-blue-100 text-nexora-blue text-xs px-2 py-0.5 rounded-full font-bold">
                  {myTickets.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {activeTab === 'help' && (
          <div className="space-y-8">
            {/* Step 1: Problem Category Selector Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-nexora-blue text-white text-xs flex items-center justify-center font-black">1</span>
                    Select your problem category
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click on the topic that best matches what you need assistance with
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {PROBLEM_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat)}
                      className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-36 ${
                        isSelected
                          ? 'bg-blue-50/80 border-nexora-blue shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      {cat.badge && (
                        <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {cat.badge}
                        </span>
                      )}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-nexora-blue text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 leading-tight">
                          {cat.title}
                        </h3>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Interactive Troubleshooting Wizard */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-nexora-blue flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Common issues in "{selectedCategory.title}"
                    </h3>
                    <p className="text-xs text-gray-500">
                      Select specific concern below for instant resolution steps
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('ticket');
                    setTicketForm((prev) => ({
                      ...prev,
                      category: selectedCategory.id,
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-nexora-blue hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Submit a Ticket for this category →
                </button>
              </div>

              {/* Issue Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {selectedCategory.issues.map((issue, idx) => {
                  const isSelected = selectedIssue?.type === issue.type;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleIssueSelect(issue)}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-gray-800">
                          {issue.type}
                        </h4>
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isSelected ? 'text-nexora-blue' : 'text-gray-300'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                        {issue.solution}
                      </p>
                      {issue.actionLink && (
                        <Link
                          to={issue.actionLink}
                          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-nexora-blue hover:underline"
                        >
                          {issue.actionText} <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 3: 24x7 Direct Support Channels Bar */}
            <section className="bg-gradient-to-r from-gray-900 to-blue-950 rounded-xl p-6 text-white shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-nexora-yellow shrink-0">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Toll-Free Phone</h4>
                    <p className="text-base font-bold text-white">1800-208-9898</p>
                    <p className="text-[10px] text-emerald-400">Available 24x7 across India</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Direct Email</h4>
                    <p className="text-base font-bold text-white">support@nexora.com</p>
                    <p className="text-[10px] text-gray-300">Guaranteed reply within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 uppercase font-semibold">Priority Resolution</h4>
                    <p className="text-base font-bold text-white">100% SLA Guarantee</p>
                    <p className="text-[10px] text-gray-300">Dedicated dispute managers</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 4: Searchable Frequently Asked Questions */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Frequently Asked Questions (FAQs)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Quick answers to the most common customer questions
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => {
                    const isOpen = expandedFaq === idx;
                    return (
                      <div key={idx} className="py-3.5">
                        <button
                          onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                          className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-gray-800 hover:text-nexora-blue gap-4"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-nexora-blue shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="mt-2.5 text-xs text-gray-600 leading-relaxed pl-1 animate-in fade-in duration-150">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-gray-500">
                    No FAQs found matching "{searchQuery}". Try a different keyword or submit a ticket.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Raise Support Ticket Form */}
        {activeTab === 'ticket' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-nexora-blue text-xs font-bold px-2.5 py-1 rounded-md mb-2">
                <Send className="w-3.5 h-3.5" /> 24x7 Ticket Resolution
              </div>
              <h2 className="text-xl font-black text-gray-900">
                Submit a Support Ticket
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Provide details about your issue below. Our team will review and respond with an official resolution update.
              </p>
            </div>

            {ticketSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">
                      Ticket Created Successfully!
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1">
                      Your Ticket ID is{' '}
                      <span className="font-extrabold bg-emerald-100 px-2 py-0.5 rounded text-emerald-950">
                        {ticketSuccess.ticketId}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      Our 24x7 support desk is on it. A confirmation has been registered for{' '}
                      <strong>{ticketSuccess.email}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ticketError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{ticketError}</span>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={ticketForm.phone}
                    onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Order ID (If applicable)
                  </label>
                  <input
                    type="text"
                    value={ticketForm.orderId}
                    onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                    placeholder="e.g. 64d9f... or ORD-9982"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Problem Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    {PROBLEM_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden bg-white"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Standard issue</option>
                    <option value="high">High - Delayed shipment / return</option>
                    <option value="urgent">Urgent - Payment debited / lost package</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Describe Your Issue in Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="Please describe the issue in detail (order details, courier delays, item issues, etc.)..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-blue focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-nexora-blue hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    'Submitting Ticket...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Register Support Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: My Support Tickets (Authenticated) */}
        {activeTab === 'my-tickets' && isAuthenticated && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Your Support Tickets History
                </h3>
                <p className="text-xs text-gray-500">
                  Track ongoing inquiries and status updates for your account ({user?.email})
                </p>
              </div>
              <button
                onClick={fetchMyTickets}
                className="text-xs text-nexora-blue font-bold hover:underline"
              >
                Refresh
              </button>
            </div>

            {loadingTickets ? (
              <div className="py-12 text-center text-xs text-gray-500">
                Loading your support history...
              </div>
            ) : myTickets.length > 0 ? (
              <div className="space-y-3">
                {myTickets.map((tkt) => (
                  <div
                    key={tkt._id}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-xs text-gray-900">
                          {tkt.ticketId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            tkt.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tkt.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tkt.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-semibold">
                          {tkt.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(tkt.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 mt-2 font-medium">
                      {tkt.message}
                    </p>

                    {tkt.orderId && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        Related Order: <span className="font-semibold text-gray-800">{tkt.orderId}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700">No support tickets found</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  You have not submitted any customer support tickets yet.
                </p>
                <button
                  onClick={() => setActiveTab('ticket')}
                  className="mt-4 px-4 py-2 bg-nexora-blue text-white rounded text-xs font-bold hover:bg-blue-700 transition"
                >
                  Raise New Ticket
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCare;
