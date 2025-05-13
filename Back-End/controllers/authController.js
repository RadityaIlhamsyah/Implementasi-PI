const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const newUser = new User({ name, email, password, role: 'customer' });
    await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Server error saat register' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Password salah' });

    // Simpan informasi user di sesi
    req.session.user = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };

    res.status(200).json({ message: 'Login berhasil', user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error saat login' });
  }
};
