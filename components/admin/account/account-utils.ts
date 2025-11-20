// Utility functions for email and password generation
export const removeVietnameseDiacritics = (str: string): string => {
  const diacriticsMap: Record<string, string> = {
    à: 'a',
    á: 'a',
    ạ: 'a',
    ả: 'a',
    ã: 'a',
    â: 'a',
    ầ: 'a',
    ấ: 'a',
    ậ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ă: 'a',
    ằ: 'a',
    ắ: 'a',
    ặ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    è: 'e',
    é: 'e',
    ẹ: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ê: 'e',
    ề: 'e',
    ế: 'e',
    ệ: 'e',
    ể: 'e',
    ễ: 'e',
    ì: 'i',
    í: 'i',
    ị: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ò: 'o',
    ó: 'o',
    ọ: 'o',
    ỏ: 'o',
    õ: 'o',
    ô: 'o',
    ồ: 'o',
    ố: 'o',
    ộ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ơ: 'o',
    ờ: 'o',
    ớ: 'o',
    ợ: 'o',
    ở: 'o',
    ỡ: 'o',
    ù: 'u',
    ú: 'u',
    ụ: 'u',
    ủ: 'u',
    ũ: 'u',
    ư: 'u',
    ừ: 'u',
    ứ: 'u',
    ự: 'u',
    ử: 'u',
    ữ: 'u',
    ỳ: 'y',
    ý: 'y',
    ỵ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    đ: 'd',
    À: 'A',
    Á: 'A',
    Ạ: 'A',
    Ả: 'A',
    Ã: 'A',
    Â: 'A',
    Ầ: 'A',
    Ấ: 'A',
    Ậ: 'A',
    Ẩ: 'A',
    Ẫ: 'A',
    Ă: 'A',
    Ằ: 'A',
    Ắ: 'A',
    Ặ: 'A',
    Ẳ: 'A',
    Ẵ: 'A',
    È: 'E',
    É: 'E',
    Ẹ: 'E',
    Ẻ: 'E',
    Ẽ: 'E',
    Ê: 'E',
    Ề: 'E',
    Ế: 'E',
    Ệ: 'E',
    Ể: 'E',
    Ễ: 'E',
    Ì: 'I',
    Í: 'I',
    Ị: 'I',
    Ỉ: 'I',
    Ĩ: 'I',
    Ò: 'O',
    Ó: 'O',
    Ọ: 'O',
    Ỏ: 'O',
    Õ: 'O',
    Ô: 'O',
    Ồ: 'O',
    Ố: 'O',
    Ộ: 'O',
    Ổ: 'O',
    Ỗ: 'O',
    Ơ: 'O',
    Ờ: 'O',
    Ớ: 'O',
    Ợ: 'O',
    Ở: 'O',
    Ỡ: 'O',
    Ù: 'U',
    Ú: 'U',
    Ụ: 'U',
    Ủ: 'U',
    Ũ: 'U',
    Ư: 'U',
    Ừ: 'U',
    Ứ: 'U',
    Ự: 'U',
    Ử: 'U',
    Ữ: 'U',
    Ỳ: 'Y',
    Ý: 'Y',
    Ỵ: 'Y',
    Ỷ: 'Y',
    Ỹ: 'Y',
    Đ: 'D'
  }

  return str
    .split('')
    .map((char) => diacriticsMap[char] || char)
    .join('')
    .toLowerCase()
}

export const generateEmailFromName = (name: string): string => {
  if (!name.trim()) return ''

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''

  // Lấy tên (phần cuối cùng)
  const lastName = removeVietnameseDiacritics(parts[parts.length - 1])

  // Lấy chữ cái đầu của các phần còn lại (họ và tên đệm)
  const initials = parts
    .slice(0, -1)
    .map((part) => removeVietnameseDiacritics(part)[0])
    .join('')

  // Format: tên + chữ cái đầu của họ và tên đệm
  const email = `${lastName}${initials}@gmail.com`

  return email
}

export const generateRandomPassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '!@#$%^&*'

  // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
  let password = ''
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Thêm các ký tự ngẫu nhiên để đủ 12 ký tự
  const allChars = lowercase + uppercase + numbers + special
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle password để không có pattern rõ ràng
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

// Read Excel file and extract accounts data (name, email)
export const readExcelFile = async (file: File): Promise<Array<{ name: string; email: string; row: number }>> => {
  const XLSX = await import('xlsx')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as Array<Array<string>>

        // Find header row (look for "name" and "email" columns)
        let nameColIndex = -1
        let emailColIndex = -1
        let headerRowIndex = -1

        for (let i = 0; i < Math.min(5, jsonData.length); i++) {
          const row = jsonData[i]
          const nameIndex = row.findIndex(
            (cell) => String(cell).toLowerCase().includes('name') || String(cell).toLowerCase().includes('tên')
          )
          const emailIndex = row.findIndex((cell) => String(cell).toLowerCase().includes('email'))

          if (nameIndex >= 0 && emailIndex >= 0) {
            nameColIndex = nameIndex
            emailColIndex = emailIndex
            headerRowIndex = i
            break
          }
        }

        // If no header found, assume first row is header and columns are A (name) and B (email)
        if (nameColIndex === -1 || emailColIndex === -1) {
          nameColIndex = 0
          emailColIndex = 1
          headerRowIndex = -1
        }

        // Extract data rows
        const accounts: Array<{ name: string; email: string; row: number }> = []
        const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 0

        for (let i = startRow; i < jsonData.length; i++) {
          const row = jsonData[i]
          const name = String(row[nameColIndex] || '').trim()
          const email = String(row[emailColIndex] || '').trim()

          // Skip empty rows
          if (!name && !email) continue

          accounts.push({
            name,
            email,
            row: i + 1 // Excel row number (1-based)
          })
        }

        resolve(accounts)
      } catch (error) {
        reject(new Error('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Không thể đọc file. Vui lòng thử lại.'))
    }
    reader.readAsBinaryString(file)
  })
}
