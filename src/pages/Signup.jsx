<select onChange={(e) => setRole(e.target.value)} required>
  <option value="">Select Role</option>
  <option value="customer">Customer</option>
  <option value="vendor">Vendor</option>
  <option value="worker">Worker</option>
  <option value="admin">Admin</option>
</select>

<select onChange={(e) => setState(e.target.value)} required>
  <option value="">Select State</option>
  <option value="Lagos">Lagos</option>
  <option value="Abuja">Abuja</option>
</select>

<select onChange={(e) => setLga(e.target.value)} required>
  <option value="">Select LGA</option>
  <option value="Ikeja">Ikeja</option>
  <option value="Surulere">Surulere</option>
</select>
