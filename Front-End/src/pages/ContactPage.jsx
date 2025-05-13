import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!form.name || !form.email || !form.message) {
      setStatus({
        submitted: true,
        success: false,
        message: 'Harap isi semua field yang wajib diisi',
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus({
        submitted: true,
        success: false,
        message: 'Format email tidak valid',
      });
      return;
    }

    try {
      setLoading(true);

      // Here you would normally send the form data to your backend
      // For now, we'll just simulate a success response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus({
        submitted: true,
        success: true,
        message: 'Pesan Anda berhasil dikirim. Kami akan segera menghubungi Anda.',
      });

      // Reset form after successful submission
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setLoading(false);
    } catch (error) {
      console.error('Error sending contact form:', error);
      setStatus({
        submitted: true,
        success: false,
        message: 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.',
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Hubungi Kami</h1>
          <p className="max-w-2xl mx-auto">Kami senang mendengar dari Anda. Silakan hubungi kami untuk pertanyaan, umpan balik, atau pesanan khusus.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin size={24} className="text-teal-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Alamat</h3>
                  <p className="text-gray-600">
                    Jl. Pahlawan No. 123
                    <br />
                    Kota Jakarta, 12345
                    <br />
                    Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone size={24} className="text-teal-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Telepon</h3>
                  <p className="text-gray-600">
                    +62 21 1234 5678
                    <br />
                    +62 812 3456 7890
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail size={24} className="text-teal-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">info@tokocicikitchen.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock size={24} className="text-teal-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Jam Operasional</h3>
                  <p className="text-gray-600">
                    Senin - Jumat: 08.00 - 20.00
                    <br />
                    Sabtu - Minggu: 10.00 - 18.00
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-lg overflow-hidden h-64 bg-gray-200">
              {/* In a real application, you would embed a Google Map here */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p>Google Maps akan ditampilkan di sini</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>

            {status.submitted && <div className={`p-4 rounded mb-6 ${status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{status.message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Nama Lengkap *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Subjek</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Pesan *</label>
                <textarea name="message" value={form.message} onChange={handleChange} className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500" rows="5" required></textarea>
              </div>

              <button type="submit" disabled={loading} className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition duration-200 flex items-center disabled:bg-gray-400">
                {loading ? (
                  'Mengirim...'
                ) : (
                  <>
                    <span>Kirim Pesan</span>
                    <Send size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Pertanyaan yang Sering Diajukan</h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Berapa lama waktu pengiriman?</h3>
                <p className="text-gray-600">Waktu pengiriman tergantung pada lokasi Anda. Untuk area Jakarta, biasanya 1-2 hari kerja. Untuk luar Jakarta, bisa memakan waktu 3-5 hari kerja.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Apakah ada biaya pengiriman?</h3>
                <p className="text-gray-600">Ya, biaya pengiriman dihitung berdasarkan jarak dan berat total pesanan. Biaya akan ditampilkan saat checkout.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Bagaimana cara melakukan pemesanan khusus?</h3>
                <p className="text-gray-600">Untuk pemesanan khusus atau dalam jumlah besar, silakan hubungi kami melalui formulir kontak di atas atau langsung telepon ke nomor yang tersedia.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Apakah ada promo atau diskon?</h3>
                <p className="text-gray-600">Kami sering mengadakan promo dan diskon. Silakan pantau halaman beranda kami atau ikuti media sosial kami untuk informasi terbaru.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
