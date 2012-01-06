class FileSystem(Thread):
  def __init__(self):
    pass
  
  def run(self):
    print "ok"

if __name__ == '__main__':
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
  s.bind((Config.HOST, Config.PORT))
  s.listen(1)
  
  conn, addr = s.accept()
  t = FileSystem()
  t.start()