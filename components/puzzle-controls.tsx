'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FileSaver from 'file-saver'
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, HeightRule } from 'docx'
import { jsPDF } from 'jspdf'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import html2canvas from 'html2canvas'

interface PuzzleControlsProps {
  category: string
  difficulty: string
  level: number
  onUpdate: (category: string, difficulty: string, level: number) => void
  isPremium: boolean
  downloadCount: number
  onDownload: () => void
}

export function PuzzleControls({
  category,
  difficulty,
  level,
  onUpdate,
  isPremium,
  downloadCount,
  onDownload
}: PuzzleControlsProps) {
  const [currentCategory, setCurrentCategory] = useState(category)
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty)
  const [currentLevel, setCurrentLevel] = useState(level.toString())
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const router = useRouter()

  const handleUpdate = () => {
    const newLevel = parseInt(currentLevel, 10)
    if (newLevel > 5 && !isPremium) {
      setShowUpgradeDialog(true)
      return
    }
    onUpdate(currentCategory, currentDifficulty, newLevel)
  }

  const handleExportOrPrint = async (action: 'print' | 'pdf' | 'word' | 'jpg') => {
    const currentLevel = parseInt(level.toString(), 10)
    
    // Check download limits only for non-print actions
    if (action !== 'print') {
      if (!isPremium && downloadCount >= 10) {
        alert('You have reached your daily download limit. Upgrade to Premium for more downloads!')
        return
      }
      if (isPremium && downloadCount >= 25) {
        alert('You have reached your daily download limit.')
        return
      }
    }

    // Allow free downloads/prints for levels 1-5
    if (currentLevel > 5 && !isPremium && action !== 'print') {
      setShowUpgradeDialog(true)
      return
    }

    if (action === 'print') {
      window.print()
    } else {
      const puzzleContent = document.querySelector('.print-content')
      if (!puzzleContent) return

      if (action === 'pdf' || action === 'jpg') {
        const canvas = await html2canvas(puzzleContent as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false
        })

        if (action === 'pdf') {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          })

          const imgData = canvas.toDataURL('image/png')
          const imgProps = pdf.getImageProperties(imgData)
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
          pdf.save(`word_search_puzzle_${currentLevel}.pdf`)
        } else {
          // JPG export
          canvas.toBlob((blob) => {
            if (blob) {
              FileSaver.saveAs(blob, `word_search_puzzle_${currentLevel}.jpg`)
            }
          }, 'image/jpeg', 1.0)
        }
        onDownload()
      } else if (action === 'word') {
        const wordsToFind = Array.from(puzzleContent.querySelectorAll('.words-list div')).map(el => el.textContent)
        const gridCells = Array.from(puzzleContent.querySelectorAll('.puzzle-grid > div')).map(cell => cell.textContent || '')
        const gridSize = Math.sqrt(gridCells.length)

        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun({ text: `Word Search Puzzle ${currentLevel}`, size: 32, bold: true })],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [new TextRun({ text: `Category: ${category}, Difficulty: ${difficulty}`, size: 24, bold: true })],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [new TextRun({ text: "Words to Find:", size: 24, bold: true })],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [new TextRun({ text: wordsToFind.join(', '), size: 16 })],
                alignment: AlignmentType.CENTER
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: Array(gridSize).fill(0).map((_, rowIndex) =>
                  new TableRow({
                    children: Array(gridSize).fill(0).map((_, colIndex) =>
                      new TableCell({
                        children: [new Paragraph({
                          children: [new TextRun({ text: gridCells[rowIndex * gridSize + colIndex], size: 16, bold: true })],
                          alignment: AlignmentType.CENTER
                        })],
                        width: { size: 100 / gridSize, type: WidthType.PERCENTAGE },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
                          bottom: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
                          left: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
                          right: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
                        },
                        verticalAlign: AlignmentType.CENTER
                      })
                    ),
                    height: { value: 300, rule: HeightRule.EXACT }
                  })
                )
              })
            ]
          }]
        })

        Packer.toBlob(doc).then(blob => {
          FileSaver.saveAs(blob, `word_search_puzzle_${currentLevel}.docx`)
          onDownload()
        })
      }
    }
  }

  return (
    <>
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-4">Puzzle Controls</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <Select value={currentCategory} onValueChange={setCurrentCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="teenagers">Teenagers</SelectItem>
                <SelectItem value="adults">Adults</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              Difficulty
            </label>
            <Select value={currentDifficulty} onValueChange={setCurrentDifficulty}>
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-1">
              Puzzle
            </label>
            <Select value={currentLevel} onValueChange={setCurrentLevel}>
              <SelectTrigger id="level" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(200)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Puzzle {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdate} className="w-full">Update Puzzle</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleExportOrPrint('print')}>Print</Button>
            <Button onClick={() => handleExportOrPrint('pdf')}>PDF</Button>
            <Button onClick={() => handleExportOrPrint('word')}>Word</Button>
            <Button onClick={() => handleExportOrPrint('jpg')}>JPG</Button>
          </div>
          <p className="text-sm text-gray-500">
            Downloads remaining today: {isPremium ? 25 - downloadCount : 10 - downloadCount}
          </p>
        </div>
      </div>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              To access levels above 5 and unlock unlimited downloads, upgrade to our Premium plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => router.push('/pricing')}>
              View Premium Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

