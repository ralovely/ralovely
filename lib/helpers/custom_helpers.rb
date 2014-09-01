module CustomHelpers
  def my_age
    now = Date.today
    b_day = Date.civil(1977, 2, 20)
    age_in_days = (now - b_day).to_i
    age_in_years = (age_in_days/365.25).to_i
  end
end
